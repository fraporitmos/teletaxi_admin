import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../Modal";
import RemoteService from "../../Network/RemoteService";
import "../../App.css";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { ZoomIn, ZoomOut, Crosshair } from "lucide-react";
import Select from "react-select";


function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function getMapCenterFromCoords(coordsNorthwest, coordsSoutheast) {
  const lat = (coordsNorthwest.lat + coordsSoutheast.lat) / 2;
  const lng = (coordsNorthwest.lon + coordsSoutheast.lon) / 2;
  return { lat, lng };
}

function getBoundsFromCoords(coordsNorthwest, coordsSoutheast) {
  return {
    north: Math.max(coordsNorthwest.lat, coordsSoutheast.lat),
    south: Math.min(coordsNorthwest.lat, coordsSoutheast.lat),
    east: Math.max(coordsNorthwest.lon, coordsSoutheast.lon),
    west: Math.min(coordsNorthwest.lon, coordsSoutheast.lon),
  };
}


function TravelModal({ isOpen, onClose }) {
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [existPassenger, setExistPassenger] = useState(false);
  const [selectPlaceSaved, setSelectPlaceSaved] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    lat: -12.046374,
    lng: -77.042793,
  });
  const [mapZoom, setMapZoom] = useState(14);
  const [autocompleteBounds, setAutocompleteBounds] = useState(null);
  // Google Maps API
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: GOOGLE_MAPS_API_KEY,
    debounce: 500,
  });
  // Form and refs
  const mapRef = useRef(null);
  const hasFetchedCities = useRef(false);
  const passengerIdDynamicRef = useRef("");
  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const cityRegister = register("cityId", { required: "City is required" });
  const selectedCity = watch("cityId");
  const phonePassenger = watch("phonePassenger");

  useEffect(() => {
    if (!isOpen) return;
    async function fetchCities() {
      try {
        if (!hasFetchedCities.current) {
          const { items } = await RemoteService.get("/collections/city/records");
          setCities(items);
          hasFetchedCities.current = true;
        }
      } catch (err) {
        alert("Failed to fetch cities. " + err);
      }
    }
    fetchCities();
  }, [isOpen]);

  useEffect(() => {
    if (!(isOpen && /^\d{9}$/.test(phonePassenger))) return;
    fetchPassengerAndPlaces(phonePassenger);
  }, [phonePassenger, isOpen]);

  async function fetchPassengerAndPlaces(phone) {
    try {
      const filter = encodeURIComponent(`phonePassenger="${phone}"`);
      const { items } = await RemoteService.get(
        `/collections/passenger/records?expand=cityId&filter=${filter}`
      );
      if (items.length) {
        const passenger = items[0];
        passengerIdDynamicRef.current = passenger.id;
        setExistPassenger(true);
        setValue("namesPassenger", passenger.namesPassenger);
        setValue("cityId", passenger.cityId);
        handleSetAutocompleteCoords(passenger.coordsNorthwest, passenger.coordsSoutheast);
        fetchSavedPlaces(passenger.id);
      }
    } catch (err) {
      console.error("Error buscando pasajero:", err);
    }
  }

  async function fetchSavedPlaces(passengerId) {
    try {
      const filter = encodeURIComponent(`passengerId="${passengerId}"`);
      const { items } = await RemoteService.get(
        `/collections/places_passenger/records?filter=${filter}&sort=-created`
      );
      setPlaces(items);
    } catch (err) {
      console.error("Error loading saved places:", err);
    }
  }

  function handleCitySelect(e) {
    const selectedId = e.target.value;
    const city = cities.find((c) => c.id === selectedId);
    if (city) {
      handleSetAutocompleteCoords(city.coordsNorthwest, city.coordsSoutheast);
    }
  }

  function handleSetAutocompleteCoords(coordsNorthwest, coordsSoutheast) {
    const center = getMapCenterFromCoords(coordsNorthwest, coordsSoutheast);
    setMarkerPosition(center);
    setAutocompleteBounds(getBoundsFromCoords(coordsNorthwest, coordsSoutheast));
    setValue("originAddress", "");
    getPlacePredictions({
      input: "",
      locationBias: {
        north: -0.04,
        south: -18.35,
        east: -68.65,
        west: -81.33,
      },
    });
  }

  function handleSavedPlaceSelect(e) {
    const selectedAddress = e.target.value;
    const place = places.find((p) => p.address === selectedAddress);
    if (place) {
      setSelectPlaceSaved(true);
      setValue("reference", place.reference || place.address);
      setValue("originAddress", place.address);
      setMarkerPosition({ lat: place.location.lat, lng: place.location.lon });
      setMapZoom(16);
    }
  }


  async function handleCreatePlace(placeData) {
    try {
      await RemoteService.post("/collections/places_passenger/records", placeData);
    } catch (err) {
      // console.error("Error creating place", err);
    }
  }

  async function handleCreateTravel(travelFormData, marker, passengerId, selectedCityId, resetForm, closeModal) {
    const now = new Date();
    const formattedDate = formatDate(now);
    const travelBody = {
      originAddress: travelFormData.originAddress,
      destinationAddress: travelFormData.destinationAddress || "",
      originLocationLat: marker.lat,
      originLocationLng: marker.lng,
      destinationLocationLat: marker.lat,
      destinationLocationLng: marker.lng,
      reference: travelFormData.reference,
      type: "WEB",
      passengerId: passengerId,
      cityId: selectedCityId,
      dateRequest: formattedDate,
      priceTravel: travelFormData.price,
    };
    const response = await fetch("https://teletaxiv1.fraporitmos.com/api/travels/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(travelBody),
    });
    if (response.ok) {
      try {
      
        await fetch("https://teletaxiv1.fraporitmos.com/api/token/pushdriver", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: "Nueva solicitud Web",
            descripcion: "Hay una nueva solicitud de viaje para ti.",
            latitudOrigen: marker.lat,
            longitudOrigen: marker.lng,
            cityId: selectedCityId,
          }),
        });
      } catch (err) {
        // Optionally handle error
      }
      setExistPassenger(false);
      setSelectPlaceSaved(false);
      passengerIdDynamicRef.current = "";
      resetForm();
      closeModal();
    }
  }

  // ------------- Form Submit Handler -------------
  async function onSubmit(formData) {
    let passengerId = passengerIdDynamicRef.current;
    if (!existPassenger) {
      const { namesPassenger, phonePassenger, cityId } = formData;
      const statusPassenger = "activo";
      const response = await RemoteService.post(
        "/collections/passenger/records",
        { phonePassenger, namesPassenger, cityId, statusPassenger }
      );
      passengerId = response.id;
      passengerIdDynamicRef.current = response.id;
    }

    if (!selectPlaceSaved) {
      const placeData = new FormData();
      placeData.append("address", formData.originAddress);
      placeData.append("reference", formData.reference);
      placeData.append(
        "location",
        JSON.stringify({ lat: markerPosition.lat, lon: markerPosition.lng })
      );
      placeData.append("passengerId", passengerIdDynamicRef.current);
      await handleCreatePlace(placeData);
    }

    // Always create travel
    await handleCreateTravel(
      formData,
      markerPosition,
      passengerIdDynamicRef.current,
      selectedCity,
      reset,
      onClose
    );
  }

  const placeOptions = places.map((p) => ({
    value: p.address,
    label: (
      <div className="text-xs" style={{ whiteSpace: "pre-wrap" }}>
        {p.address}
        <br />
        <span className="font-bold">Referencia: </span>
        {p.reference}
      </div>
    ),
  }));

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Viaje">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 scroll-default  max-h-[85vh] overflow-y-auto custom-scroll"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <input
              placeholder="Teléfono"
              id="phonePassenger"
              {...register("phonePassenger", {
                required: "El teléfono es obligatorio",
                maxLength: { value: 9, message: "Debe tener 9 dígitos" },
                minLength: { value: 9, message: "Debe tener 9 dígitos" },
              })}
              maxLength={9}
              className="block w-full px-4 py-2  bg-white border border-primaryLight rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
          </div>

          <div>
            <input
              placeholder="Nombres del pasajero"
              id="namesPassenger"
              {...register("namesPassenger", {
                required: "El nombre es obligatorio",
              })}
              className="block w-full px-4 py-2  bg-white border border-primaryLight rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
          </div>

          <div>
            <select
              id="cityId"
              {...cityRegister}
              onChange={(e) => {
                cityRegister.onChange(e);
                handleCitySelect(e);
              }}
              className="block w-full px-4 py-2  bg-white border border-gray-200 rounded-md text-black dark:border-gray-600 focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            >
              <option value="">Selecciona ciudad</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.nameCity}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div>
              <Select
                id="origin"
                className="absolute z-20 max-h-60"
                options={placeOptions}
                onChange={(opt) => {
                  setValue("origin", opt.value);
                  handleSavedPlaceSelect({ target: { value: opt.value } });
                }}
                placeholder="Lugares guardados"
                styles={{
                  container: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  control: (provided) => ({
                    ...provided,
                    width: "100%",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    maxLines: 1,
                    maxHeight: 20,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }),
                  option: (provided) => ({
                    ...provided,
                    borderBottom: "1px solid #000000",
                    padding: 8,
                  }),
                }}
              />
            </div>
          </div>

          <div>
            <input
              id="originAddress"
              {...register("originAddress", {
                required: "La ciudad  es obligatorio",
              })}
              className="block w-full px-4 py-2 bg-white border border-primaryLight rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40 focus:outline-none"
              placeholder="Busca una dirección"
              onChange={(e) => {
                if (!selectedCity) {
                  setValue("originAddress", "");
                  alert("Selecciona una ciudad primero");
                  return;
                }
                getPlacePredictions({
                  input: e.target.value,
                  locationBias: {
                    north: -0.04,
                    south: -18.35,
                    east: -68.65,
                    west: -81.33,
                  },
                });
              }}
            />
            {isPlacePredictionsLoading && (
              <p className="bg-white text-black rounded-md  p-2 text-md">
                Cargando...
              </p>
            )}
            <ul className="bg-white absolute z-10 rounded-md max-h-40 overflow-auto mt-1">
              {placePredictions.map((pred) => (
                <li
                  key={pred.place_id}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    placesService.getDetails(
                      { placeId: pred.place_id },
                      (placeDetails) => {
                        const lat = placeDetails.geometry.location.lat();
                        const lng = placeDetails.geometry.location.lng();
                        setSelectPlaceSaved(false);
                        setMarkerPosition({ lat, lng });
                        setMapZoom(16);
                        setValue(
                          "originAddress",
                          pred.description +
                            " " +
                            placeDetails.formatted_address
                        );
                        getPlacePredictions({ input: "" });
                      }
                    );
                  }}
                >
                  {pred.description}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <input
              placeholder="Referencia"
              id="reference"
              {...register("reference", {
                required: "El nombre es obligatorio",
              })}
              className="block w-full px-4 py-2  bg-white border border-primaryLight rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
          </div>
          <div>
          <input
              placeholder="Precio"
              id="price"
              type="text"
              step="any"
              defaultValue={8}
              {...register("price", { valueAsNumber: true })}
              className="block w-full px-4 py-2  bg-white border border-primaryLight rounded-md text-dark focus:ring focus:ring-primary focus:ring-opacity-40  focus:outline-none"
            />
          </div>
        </div>

        <div className="relative w-full mb-4">
          <div className="absolute bottom-24 right-2 z-10 flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => setMapZoom((z) => Math.min(z + 1, 21))}
              className="bg-white p-2  rounded shadow"
            >
              <ZoomIn size={24} />
            </button>
            <button
              type="button"
              onClick={() => setMapZoom((z) => Math.max(z - 1, 0))}
              className="bg-white p-2 rounded shadow"
            >
              <ZoomOut size={24} />
            </button>
          </div>
          <div className="absolute top-16 right-2 z-10 flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => {
                if (mapRef.current) mapRef.current.panTo(markerPosition);
                setMapZoom(mapZoom);
              }}
              className="bg-white p-2 rounded shadow"
            >
              <Crosshair size={24} />
            </button>
          </div>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={markerPosition}
            zoom={mapZoom}
            options={{
              mapTypeControl: true,
              fullscreenControl: true,
              streetViewControl: false,
              rotateControl: false,
            }}
            onClick={(e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              setMarkerPosition({ lat, lng });
            }}
            onLoad={(map) => (mapRef.current = map)}
          >
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={(e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setMarkerPosition({ lat, lng });
              }}
            />
          </GoogleMap>
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 text-white bg-primaryLight rounded-lg hover:bg-primaryDark transition-colors duration-200"
        >
          Enviar
        </button>
      </form>
    </Modal>
  );
}

export default TravelModal;

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import RemoteService from "../Network/RemoteService";
import { Marker, InfoWindow } from "@react-google-maps/api";
import io from "socket.io-client";
import ocupadoIcon from '../Assets/m_ocupado.svg';
import disponibleIcon from '../Assets/m_disponible.svg';
import enrutaIcon from '../Assets/m_enruta.svg';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const MapPage = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);

  const mapRef = useRef(null);
  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    RemoteService.get("/collections/city/records")
      .then((response) => {
        return response;
      })
      .then(({ items }) => {
        const options = items
          .map((rec) => {
            const nw = rec.coordsNorthwest;
            const se = rec.coordsSoutheast;
            if (!nw?.lat || !nw?.lon || !se?.lat || !se?.lon) return null;
            const lat = (nw.lon + se.lon) / 2;
            const lng = (nw.lat + se.lat) / 2;
            return {
              value: { lat, lng },
              label: rec.nameCity || rec.name,
            };
          })
          .filter((opt) => opt !== null);
        setCities(options);
        if (options.length > 0) {
          setSelectedCity(options[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch cities:", err));
  }, []);

  useEffect(() => {
    if (selectedCity && mapRef.current) {
      mapRef.current.panTo(selectedCity.value);
    }
  }, [selectedCity]);

  useEffect(() => {
    const socket = io("https://teletaxiv1.fraporitmos.com/location_driver", {
      path: "/socket.io",
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    socket.on("position_web", (data) => {
      const marker = {
        id: data.unidad,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        nombres: data.nombres,
        status: data.status,
        unidad: data.unidad,
      };
      setMarkers((prev) => {
        const exists = prev.some((m) => m.id === marker.id);
        if (exists) {
          return prev.map((m) => (m.id === marker.id ? marker : m));
        }
        return [...prev, marker];
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const center = {
    lat: -12.046374,
    lng: -77.042793,
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div
      className="ml-20"
      style={{ position: "relative", width: "100%", height: "100vh" }}
    >
      {/* city and driver selects */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 15,
          width: "300px",
        }}
      >
        <Select
          options={cities}
          value={selectedCity}
          onChange={(option) => setSelectedCity(option)}
          placeholder="Select city"
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 10,
          zIndex: 10,
          width: "300px",
        }}
      >
        <Select
          options={markers.map((m) => ({
            value: m.id,
            label: m.nombres,
            position: { lat: m.lat, lng: m.lng },
          }))}
          onChange={(option) => {
            if (mapRef.current && option) {
              mapRef.current.panTo(option.position);
              mapRef.current.setZoom(19);
              setActiveMarker(option.value);
            }
          }}
          placeholder="Buscar conductor"
          isClearable
        />
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedCity ? selectedCity.value : center}
        zoom={12}
        onLoad={onMapLoad}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={{ lat: m.lat, lng: m.lng }}
            icon={{
              url:
                m.status === 'ocupado'
                  ? ocupadoIcon
                  : m.status === 'enruta'
                  ? enrutaIcon
                  : disponibleIcon,
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            onClick={() => setActiveMarker(m.id)}
          />
        ))}
        {activeMarker &&
          (() => {
            const m = markers.find((x) => x.id === activeMarker);
            return (
              <InfoWindow
                position={{ lat: m.lat, lng: m.lng }}
                onCloseClick={() => setActiveMarker(null)}
                options={{ pixelOffset: new window.google.maps.Size(0, -42) }}
              >
                <div>
                  <strong className="text-sm font-semibold">{m.nombres}</strong>
                  <p className="text-sm font-normal">Estado: {m.status}</p>
                  <p className="text-sm font-normal">Unidad: {m.unidad}</p>
                </div>
              </InfoWindow>
            );
          })()}
      </GoogleMap>
    </div>
  );
};

export default MapPage;

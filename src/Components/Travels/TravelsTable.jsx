import { motion } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import RemoteService from "../../Network/RemoteService";
import MapsIcon from "../../Assets/maps.png";
import "../../App.css";
import TravelModal from "./TravelModal";



function TravelsTable() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [modalDriver, setModalTravel] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      try {
        const { items } = await RemoteService.get(
          "/collections/travel/records?expand=cityId,passengerId,driverId,driverId.vehicleId&sort=-created"
        );
        const sortedItems = items.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );
        if (isMounted) {
          setRequests(sortedItems);
          setFilteredRequests(sortedItems);
        }
      } catch (err) {
        alert("Failed to fetch requests. " + err);
      }
    };

    // Initial fetch
    fetchRequests();

    // Poll every 8 seconds
    const intervalId = setInterval(fetchRequests, 8000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { items } = await RemoteService.get("/collections/city/records");
        setCities(items);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };
    fetchCities();
  }, []);

  const handleModalClose = () => {
    setModalTravel(false);
  };
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    let filtered = requests.filter((item) => {
      const lowerTerm = term.toLowerCase();
      return (
        item.namesPassenger?.toLowerCase().includes(lowerTerm) ||
        item.namesDriver?.toLowerCase().includes(lowerTerm) ||
        item.originAddress?.toLowerCase().includes(lowerTerm) ||
        item.destinationAddress?.toLowerCase().includes(lowerTerm) ||
        item.reference?.toLowerCase().includes(lowerTerm) ||
        item.status?.toLowerCase().includes(lowerTerm) ||
        item.license?.toLowerCase().includes(lowerTerm) ||
        item.color?.toLowerCase().includes(lowerTerm) ||
        item.unit?.toLowerCase().includes(lowerTerm) ||
        String(item.price).includes(lowerTerm)
      );
    });
    if (selectedCity) {
      filtered = filtered.filter((item) => item.nameCity === selectedCity);
    }
    setFilteredRequests(filtered);
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    let filtered = requests.filter((item) => {
      const lowerTerm = term.toLowerCase();
      return (
        item.namesPassenger?.toLowerCase().includes(lowerTerm) ||
        item.namesDriver?.toLowerCase().includes(lowerTerm) ||
        item.originAddress?.toLowerCase().includes(lowerTerm) ||
        item.destinationAddress?.toLowerCase().includes(lowerTerm) ||
        item.reference?.toLowerCase().includes(lowerTerm) ||
        item.status?.toLowerCase().includes(lowerTerm) ||
        item.license?.toLowerCase().includes(lowerTerm) ||
        item.color?.toLowerCase().includes(lowerTerm) ||
        item.unit?.toLowerCase().includes(lowerTerm) ||
        String(item.price).includes(lowerTerm)
      );
    });
    if (selectedCity) {
      filtered = filtered.filter((item) => item.nameCity === selectedCity);
    }
    setFilteredRequests(filtered);
  }, [searchTerm, requests, selectedCity]);

  const handleDelete = async (requestId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirmDelete) return;

    try {
      alert(requestId);
      await RemoteService.delete(`/collections/request/records/${requestId}`);
      const updatedRequests = requests.filter(
        (request) => request.id !== requestId
      );
      setRequests(updatedRequests);
      setFilteredRequests(updatedRequests);
    } catch (error) {
      alert("Failed to delete the request. " + error);
    }
  };

  return (
    <>
      <TravelModal isOpen={modalDriver} onClose={handleModalClose} />
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6 ">
          <div className="flex w-full justify-between  sm:flex-row flex-col">
            <div className="flex w-full">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-gray-700 text-white rounded-lg pl-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.nameCity}>
                    {city.nameCity}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setModalTravel(true)}
                className="py-2  ml-4 px-4 flex justify-center items-center  bg-primaryLight  focus:ring-primary focus:ring-offset-gray-200 text-white  transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Crear Viaje
              </button>
            </div>

            <div className="relative mt-6 sm:mt-0">
              <input
                type="text"
                placeholder="Search requests..."
                className="bg-gray-700  text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleSearch}
                value={searchTerm}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>
        {filteredRequests.length === 0 ? (
          <div className="text-primary w-full text-center">
            <p className="text-lg">No hay viajes por ahora.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scroll-default">
            <table className="min-w-full divide-y divide-gray-700 ">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Conductor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Unidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Pasajero
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ruta
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700 ">
                {filteredRequests.map((request) => {
                  return (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(request.created).toLocaleTimeString("es-PE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                        {request.namesDriver ? (
                          request.namesDriver
                        ) : (
                          <span>Conductor sin confirmar </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                        {request.unit ? (
                          request.unit
                        ) : (
                          <span>No confirmado</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {request.namesPassenger}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-300">
                        <strong className="text-yellow-200">Origen:</strong>{" "}
                        {request.originAddress}
                        <br />
                        <strong className="text-yellow-200">
                          Destino:
                        </strong>{" "}
                        {request.destinationAddress ? request.destinationAddress : "No hay destino"}
                        <br />
                        <strong className="text-yellow-200">
                          Referencia:
                        </strong>{" "}
                        {request.reference === ""
                          ? "Sin referencia"
                          : request.reference}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span
                          className={`px-2 w-24 text-center inline-flex justify-center items-center text-xs leading-5 font-semibold rounded-full ${
                            request.status.toLowerCase() === "pendiente"
                              ? "bg-gray-600 text-gray-100"
                              : request.status.toLowerCase() === "aceptado"
                              ? "bg-green-800 text-green-100"
                              : request.status.toLowerCase() === "finalizado"
                              ? "bg-blue-800 bg- text-blue-100"
                               : request.status.toLowerCase() === "enruta"
                              ? "bg-orange-500 text-orange-100"
                              : "bg-red-800 text-red-100"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xl whitespace-nowrap text-gray-300">
                        S/ {request.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          className="mr-2"
                          onClick={() => {
                            const { originLocation, destinationLocation } =
                              request;
                            if (originLocation && destinationLocation) {
                              const origin = `${originLocation.lat},${originLocation.lon}`;
                              const destination = `${destinationLocation.lat},${destinationLocation.lon}`;
                              const urlMaps = `https://www.google.com/maps/dir/${origin}/${destination}`;
                              window.open(urlMaps, "_blank");
                            } else {
                              alert("Coordinates not available.");
                            }
                          }}
                        >
                          <img
                            src={MapsIcon}
                            alt="Google Maps"
                            className="w-6 h-6"
                          />
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await RemoteService.patch(`/collections/travel/records/${request.id}`, {
                                status: "cancelado",
                              });
                              setRequests((prev) =>
                                prev.map((r) =>
                                  r.id === request.id ? { ...r, status: "cancelado" } : r
                                )
                              );
                              setFilteredRequests((prev) =>
                                prev.map((r) =>
                                  r.id === request.id ? { ...r, status: "cancelado" } : r
                                )
                              );
                            } catch (error) {
                              alert("Error al cancelar el viaje: " + error);
                            }
                          }}
                          className="text-red-400 mr-4 hover:text-red-300"
                        >
                          <Trash2 size={24} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default TravelsTable;
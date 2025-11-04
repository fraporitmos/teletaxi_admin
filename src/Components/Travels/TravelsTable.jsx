import { motion } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import PocketBase from "pocketbase";
import RemoteService from "../../Network/RemoteService";
import MapsIcon from "../../Assets/maps.png";
import "../../App.css";
import TravelModal from "./TravelModal";

function TravelsTable() {
  const parseDateRequest = (s) => {
    if (!s || typeof s !== "string") return 0;
    const [datePart, timePart] = s.split(" ");
    if (!datePart || !timePart) return 0;
    const [dd, mm, yy] = datePart.split("/").map(Number);
    const [HH, MM] = timePart.split(":").map(Number);
    const fullYear = yy < 100 ? 2000 + yy : yy;
    const ts = new Date(fullYear, (mm || 1) - 1, dd || 1, HH || 0, MM || 0).getTime();
    return Number.isNaN(ts) ? 0 : ts;
  };
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [modalDriver, setModalTravel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async (page = 1) => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { items, totalPages } = await RemoteService.get(
          `/collections/travel/records?filter=created~'${today}'&expand=cityId,passengerId,driverId,driverId.vehicleId&sort=-created&page=${page}&perPage=10`
        );
        const sortedItems = items.sort(
          (a, b) =>
            (parseDateRequest(b.dateRequest) || new Date(b.created).getTime()) -
            (parseDateRequest(a.dateRequest) || new Date(a.created).getTime())
        );
        if (isMounted) {
          setRequests(sortedItems);
          setFilteredRequests(sortedItems);
          setTotalPages(totalPages);
          setCurrentPage(page);
        }
      } catch (err) {
        alert("Failed to fetch requests. " + err);
      }
    };

    // Initial fetch
    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async (page = 1) => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { items, totalPages } = await RemoteService.get(
          `/collections/travel/records?filter=created~'${today}'&expand=passengerId,driverId,driverId.vehicleId&sort=-created&page=${page}&perPage=10`
        );
        const sortedItems = items.sort(
          (a, b) =>
            (parseDateRequest(b.dateRequest) || new Date(b.created).getTime()) -
            (parseDateRequest(a.dateRequest) || new Date(a.created).getTime())
        );
        if (isMounted) {
          setRequests(sortedItems);
          setFilteredRequests(sortedItems);
          setTotalPages(totalPages);
        }
      } catch (err) {
        console.error("Error actualizando viajes:", err);
      }
    };

    // Llamar inmediatamente
    fetchRequests(currentPage);

    // Intervalo cada 8 segundos
    const intervalId = setInterval(() => {
      fetchRequests(currentPage);
    }, 8000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [currentPage]);

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
        className=" backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
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
                className="py-2  ml-4 px-4 flex justify-center items-center  bg-primary focus:ring-primary focus:ring-offset-gray-200 text-white  transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Crear Viaje web
              </button>
            </div>

            <div className="relative mt-6 sm:mt-0">
              <input
                type="text"
                placeholder="Buscar viajes..."
                className="bg-gray-700  text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleSearch}
                value={searchTerm}
              />
              <Search
                className="absolute left-3 top-2.5 text-white"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Conductor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Unidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Pasajero
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Ruta
                  </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Distrito
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {request.dateRequest }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        {request.namesDriver ? (
                          request.namesDriver
                        ) : (
                          <span>Conductor sin confirmar </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        {request.unit ? (
                          request.unit
                        ) : (
                          <span>No confirmado</span>
                        )}
                      </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
      <div className="flex flex-col">
        <span>{request.namesPassenger || "Sin nombre"}</span>
        <span className="text-gray-600 text-xs">
          Tel: {request.phonePassenger || "Sin número"}
        </span>
      </div>
    </td>

                      <td className="px-6 py-4 text-sm text-black">
                        <strong className="text-green-600 font-black">Origen:</strong>{" "}
                        {request.originAddress}
                        <br />
                        <strong className="text-green-600 font-black">
                          Destino:
                        </strong>{" "}
                        {request.destinationAddress ? request.destinationAddress : "No hay destino"}
                        <br />
                        <strong className="text-green-600 font-black">
                          Referencia:
                        </strong>{" "}
                        {request.reference === ""
                          ? "Sin referencia"
                          : request.reference}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        <span
                          className={`px-2 w-24 text-center inline-flex justify-center items-center text-xs leading-5 font-semibold rounded-full ${
                            request.status.toLowerCase() === "pendiente"
                              ? "bg-gray-700 text-white"
                              : request.status.toLowerCase() === "aceptado"
                              ? "bg-green-800 text-green-100"
                                : request.status.toLowerCase() === "llegada"
                              ? "bg-purple-800 bg- text-purple-100"
                              : request.status.toLowerCase() === "finalizado"
                              ? "bg-blue-800 bg- text-blue-100"
                               : request.status.toLowerCase() === "abordo"
                              ? "bg-yellow-600 text-yellow-100"
                              : "bg-red-800 text-red-100"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xl whitespace-nowrap text-black">
                        S/ {request.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
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
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={() => {
                  const fetchRequests = async (page = 1) => {
                    try {
                      const today = new Date().toISOString().split("T")[0];
                      const { items, totalPages } = await RemoteService.get(
                        `/collections/travel/records?filter=created~'${today}'&expand=cityId,passengerId,driverId,driverId.vehicleId&sort=-created&page=${page}&perPage=10`
                      );
                      const sortedItems = items.sort(
                        (a, b) =>
                          (parseDateRequest(b.dateRequest) || new Date(b.created).getTime()) -
                          (parseDateRequest(a.dateRequest) || new Date(a.created).getTime())
                      );
                      setRequests(sortedItems);
                      setFilteredRequests(sortedItems);
                      setTotalPages(totalPages);
                      setCurrentPage(page);
                    } catch (err) {
                      alert("Failed to fetch requests. " + err);
                    }
                  };
                  fetchRequests(currentPage - 1);
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="textColor">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => {
                  const fetchRequests = async (page = 1) => {
                    try {
                      const today = new Date().toISOString().split("T")[0];
                      const { items, totalPages } = await RemoteService.get(
                        `/collections/travel/records?filter=created~'${today}'&expand=cityId,passengerId,driverId,driverId.vehicleId&sort=-created&page=${page}&perPage=10`
                      );
                      const sortedItems = items.sort(
                        (a, b) =>
                          (parseDateRequest(b.dateRequest) || new Date(b.created).getTime()) -
                          (parseDateRequest(a.dateRequest) || new Date(a.created).getTime())
                      );
                      setRequests(sortedItems);
                      setFilteredRequests(sortedItems);
                      setTotalPages(totalPages);
                      setCurrentPage(page);
                    } catch (err) {
                      alert("Failed to fetch requests. " + err);
                    }
                  };
                  fetchRequests(currentPage + 1);
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default TravelsTable;
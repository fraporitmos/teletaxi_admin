import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import "../../App.css";
import RemoteService from "../../Network/RemoteService";
import DriverModal from "./DriverModal";
import DriverUpdateModal from "./DriverUpdateModal";

function DriverTables() {
  const [passengers, setPassengers] = useState([]);
  const [filterPassengers, setfilterPassengers] = useState([]);
  const [modalDriver, setDriverModal] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [modalUpdateDriver, setModalUpdateDriver] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const hasFetchedPassenger = useRef(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (!modalDriver) {
      hasFetchedPassenger.current = false;
      fetchDrivers();
    }
  }, [modalDriver]);

  const fetchDrivers = async (page = 1) => {
    try {
      if (!hasFetchedPassenger.current || page !== currentPage) {
        const { items, totalPages } = await RemoteService.get(
          `/collections/driver/records?page=${page}&perPage=10`
        );
        setPassengers(items);
        setfilterPassengers(items);
        setTotalPages(totalPages);
        setCurrentPage(page);
        hasFetchedPassenger.current = true;
      }
    } catch (err) {
      alert("Failed to fetch drivers. " + err);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    try {
      const { items, totalPages } = await RemoteService.get(
        `/collections/driver/records?filter=(namesDriver~'${term}'||emailDriver~'${term}'||phoneDriver~'${term}')&page=1&perPage=10`
      );
      setfilterPassengers(items);
      setTotalPages(totalPages);
      setCurrentPage(1);
    } catch (err) {
      alert("Error al buscar conductores. " + err);
    }
  };

  const handleModalClose = () => {
    setDriverModal(false);
  };

  const handleModalUpdateClose = () => {
    hasFetchedPassenger.current = false;
    setModalUpdateDriver(false);
    setSelectedDriver(null);
    fetchDrivers();
  };

  return (
    <>
      <DriverModal isOpen={modalDriver} onClose={handleModalClose} />

      <DriverUpdateModal
        isOpen={modalUpdateDriver}
        onClose={handleModalUpdateClose}
        driverData={selectedDriver}
      />

      <motion.div
        className={`bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-primaryDark  mb-8`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar conductor..."
              className={`bg-gray-700 textColor placeholder-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primaryDark`}
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-white"
              size={18}
            />
          </div>
          <button
            type="button"
            onClick={() => setDriverModal(true)}
            className="py-2  w-1/4 px-4 flex justify-center items-center  bg-primary  focus:ring-primary focus:ring-offset-gray-200 text-white  transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
          >
            Nuevo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                  Nombres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                  Teléfono
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                  Ciudad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                  Status
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filterPassengers.map((driver) => (
                <motion.tr
                  key={`${driver.id}-${driver.phoneDriver}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {driver.photoUrlDriver &&
                        (driver.photoUrlDriver.startsWith("http") ||
                          driver.photoUrlDriver.startsWith("https")) ? (
                          <img
                            referrerPolicy="no-referrer"
                            src={driver.photoUrlDriver}
                            alt={driver.namesDriver}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                            {driver.namesDriver.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium textColor">
                          {driver.namesDriver}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm textColor">
                    {driver.unit}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm textColor">
                    {driver.phoneDriver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm textColor">
                    {driver.nameCity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm textColor">
                    {driver.plate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        driver.statusDriver === "activo"
                          ? "bg-green-800 text-green-100"
                          : driver.statusDriver === "pendiente"
                          ? "bg-yellow-600 text-green-100"
                          : "bg-red-800 text-red-100"
                      }`}
                    >
                      {driver.statusDriver}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm textColor">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => {
                        setSelectedDriver(driver);
                        setModalUpdateDriver(true);
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => fetchDrivers(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="textColor">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => fetchDrivers(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </>
  );
}

export default DriverTables;

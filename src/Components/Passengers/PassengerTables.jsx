import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import "../../App.css";
import RemoteService from "../../Network/RemoteService";

function PassengerTables() {
  const [passengers, setPassengers] = useState([]);
  const [filterPassengers, setfilterPassengers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const hasFetchedPassenger = useRef(false);

  useEffect(() => {
    const fetchItems = async (page = 1) => {
      try {
        if (!hasFetchedPassenger.current) {
          const { items, totalPages } = await RemoteService.get(`/collections/passenger/records?expand=cityId&sort=-created&page=${page}&perPage=10`);
          console.log(JSON.stringify(items))
          setPassengers(items);
          setfilterPassengers(items);
          setTotalPages(totalPages);
          setCurrentPage(page);
          hasFetchedPassenger.current = true;
        }
      } catch (err) {
        alert("Failed to fetch passengers. " + err);
      }
    };

    fetchItems();
  }, []);

  const fetchItems = async (page = 1) => {
    try {
      const { items, totalPages } = await RemoteService.get(`/collections/passenger/records?expand=cityId&sort=-created&page=${page}&perPage=10`);
      setPassengers(items);
      setfilterPassengers(items);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (err) {
      alert("Failed to fetch passengers. " + err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = passengers.filter(
      (item) =>
        item.names.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.phone.includes(term)
    );
    setfilterPassengers(filtered);
  };

  return (
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
            placeholder="Buscar pasajeros..."
              className={`bg-gray-700 textColor placeholder-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primaryDark`}
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-white" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                Nombres
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                Correo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium textColor uppercase tracking-wider">
                Ciudad
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
            {filterPassengers.map((passenger) => (
              <motion.tr
                key={`${passenger.id}-${passenger.phone}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {passenger.photo ? (
                        <img    referrerPolicy="no-referrer"
                         src={passenger.photo} alt={passenger.names} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                          {passenger.namesPassenger.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium textColor">
                        {passenger.namesPassenger}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm textColor">
                  {passenger.emailPassenger ? passenger.emailPassenger : `${passenger.phonePassenger}@gmail.com`}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm textColor">
                  {passenger.phonePassenger}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm textColor">
                  {passenger.nameCity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      passenger.statusPassenger === "activo"
                        ? "bg-green-800 text-green-100"
                        : "bg-red-800 text-red-100"
                    }`}
                  >
                    {passenger.statusPassenger}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm textColor">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2">
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
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={() => fetchItems(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="textColor">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => fetchItems(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </motion.div>
  );
}

export default PassengerTables;

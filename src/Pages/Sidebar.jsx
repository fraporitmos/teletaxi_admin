import  { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  ShoppingBag,
  Users,
  CarIcon,
  Settings,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Menu,
  Map,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../App.css";

const SIDEBAR = [
  { name: "Principal", icon: BarChart2, color: "#FFD000", href: "/" },
  {
    name: "Viajes",
    icon: ShoppingBag,
    color: "#FFD000",
    href: "/viajes",
  },
    { name: "Mapa", icon: Map, color: "#FFD000", href: "/mapa" },

  {
    name: "Conductores",
    icon: CarIcon,
    color: "#FFD000",
    href: "/conductores",
  },
  { name: "Pasajeros", icon: Users, color: "#FFD000", href: "/pasajeros" },

];

function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.div
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out bg-backgroundSecondary ${
          isSidebarOpen ? "w-64" : "w-24"
        }`}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
      >
        <div className="h-full backgroundSecondary bg-opacity-50 backdrop-blur-md flex-col ">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-4 rounded-full  max-w-fit"
          >
            <Menu size={28} className="textColor font-black" />
          </motion.button>

          <nav className=" flex-grow">
            {SIDEBAR.map((item, index) => (
              <Link key={item.href} to={item.href}>
                <motion.div
                  className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-primaryLight transition-colors mb-2`}
                >
                  <item.icon
                    size={20}
                    className="textColor"
                    style={{ minWidth: "20px" }}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap textColor"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
}

export default Sidebar;

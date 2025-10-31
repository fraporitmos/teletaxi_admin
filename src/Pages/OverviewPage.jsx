import Header from "../Components/Header";
import { motion } from "framer-motion";
import { Users, Zap, ShoppingBag, BarChart2 } from "lucide-react";
import SalesOverviewChart from "../Components/SalesOverviewChart";
import CategoryDistributionChart from "../Components/CategoryDistributionChart";
import SalesChannelChart from "../Components/SalesChannelChart";
import NumbersCard from "../Components/Metrics/NumbersCard";

function OverviewPage() {
  return (
    <div className="flex-1 ml-20 overflow-auto relative  z-10">
      <Header title="Panel admin" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-8">
        <motion.div
          className=" grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <NumbersCard
            name="Total de ingresos"
            icon={Zap}
            value="S/0.0"
            color="#6366F1"
          />
          <NumbersCard
            name="Usuarios de la App"
            icon={Users}
            value="0"
            color="#8B5CF6"
          />
          <NumbersCard
            name="Conductores"
            icon={ShoppingBag}
            value="0"
            color="#EC4899"
          />
          <NumbersCard
            name="Viajes Web"
            icon={BarChart2}
            value="0"
            color="#10B981"
          />
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
}

export default OverviewPage;

import React from "react";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import PassengerTables from "../Components/Passengers/PassengerTables";
import NumbersCard from "../Components/Metrics/NumbersCard";

const userStats = {
  totalUsers: 1000,
  newUsersToday: 243,
  activeUsers: 98520,
  churnRate: "2.4%",
};

function PassengerPage() {
  return (
    <div className="flex-1  ml-20  overflow-auto relative z-10">
      <Header title="Pasajeros" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <NumbersCard
            name="Total pasajeros"
            icon={UsersIcon}
            value={userStats.totalUsers.toLocaleString()}
            color="#6366F1"
          />
          <NumbersCard
            name="New Users Today"
            icon={UserPlus}
            value={userStats.newUsersToday}
            color="#10B981"
          />
          <NumbersCard
            name="Active Users"
            icon={UserCheck}
            value={userStats.activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <NumbersCard
            name="Churn Rate"
            icon={UserX}
            value={userStats.churnRate}
            color="#EF4444"
          />
        </motion.div>

        <PassengerTables />
      </main>
    </div>
  );
}

export default PassengerPage;

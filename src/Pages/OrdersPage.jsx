import React from 'react'
import Header from '../Components/Header';
import { motion } from "framer-motion";
import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import DailyOrders from '../Components/Orders/DailyOrders';
import OrderDistribution from '../Components/Orders/OrderDistribution';
import OrderTables from '../Components/Orders/OrderTables';
import NumbersCard from '../Components/Metrics/NumbersCard';

const orderStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "$98,765",
};

function OrdersPage() {
  return (
    <div className='flex-1 overflow-auto relative  z-10'>
      <Header title="Order" />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
      <motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<NumbersCard name='Total Orders' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
					<NumbersCard name='Pending Orders' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' />
					<NumbersCard
						name='Completed Orders'
						icon={CheckCircle}
						value={orderStats.completedOrders}
						color='#10B981'
					/>
					<NumbersCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />
				</motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<DailyOrders />
					<OrderDistribution />
				</div>
        <OrderTables/>
      </main>

    </div>
  )
}

export default OrdersPage
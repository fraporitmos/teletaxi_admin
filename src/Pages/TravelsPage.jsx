import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import NumbersCard from '../Components/Metrics/NumbersCard';
import TravelsTable from '../Components/Travels/TravelsTable';


function TravelsPage() {
    return (
        <div className='flex-1 overflow-auto relative  z-10'>
   <header 
      className='backgroundSecondary bg-opacity-50 
      backdrop-blur-md shadow-lg ml-20 '>
        <div className='max-w-full  mx-auto py-4 px-4 sm:px-6 lg:px-12'>
        <h1 className='text-2xl font-semibold textColor'>Solictudes</h1>
        </div>
      </header>
            <main className='max-w-full ml-20 mx-auto py-6 px-4 lg:px-8 xl:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <NumbersCard name='Total de solicitudes' icon={Package} value={144} color='#6366F1' />
                    <NumbersCard name='Viajes app' icon={TrendingUp} value={89} color='#10B981' />
                    <NumbersCard name='Viajes web' icon={AlertTriangle} value={23} color='#F59E0B' />
                    <NumbersCard name='Monto total' icon={DollarSign} value={"S/1210"} color='#EF4444' />
                </motion.div>
                <TravelsTable/>
            
            </main>

        </div>
    )
}

export default TravelsPage;
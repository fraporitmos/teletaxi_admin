import React from 'react'
import Header from '../Components/Header'
import OverviewCards from '../Components/Analytics/OverviewCards'
import Revenuechart from '../Components/Analytics/Revenuechart'
import ChannelPerformance from '../Components/Analytics/ChannelPerformance'
import ProductPerformance from '../Components/Analytics/ProductPerformance'
import UserRetention from '../Components/Analytics/UserRetention'
import CustomerSegmentation from '../Components/Analytics/CustomerSegmentation'
import AIPoweredInsights from '../Components/Analytics/AiPowerInsight'

function Analyticspage() {
    return (
        <div className='flex-1 overflow-auto relative  z-10'>
            <Header title="Analytics Dashboard" />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
              <OverviewCards/>
              <Revenuechart/>
            
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<ChannelPerformance />
					<ProductPerformance />
					<UserRetention />
					<CustomerSegmentation />
				</div>
                <AIPoweredInsights/>

            </main>

        </div>
    )
}

export default Analyticspage
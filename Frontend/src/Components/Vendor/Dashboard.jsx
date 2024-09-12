import React, { useState } from 'react';

export default function OrderOverview() {
    // State for tracking the selected time period
    const [timePeriod, setTimePeriod] = useState('Last 7 days');

    // Sample order data for demonstration
    const orderData = {
        'Last 7 days': { totalOrders: 50, deliveredOrders: 30, cancelledOrders: 5, incompleteOrders: 15, revenue: 50000 },
        'Last 30 days': { totalOrders: 200, deliveredOrders: 150, cancelledOrders: 20, incompleteOrders: 30, revenue: 250000 },
        'All-time': { totalOrders: 1500, deliveredOrders: 1300, cancelledOrders: 50, incompleteOrders: 150, revenue: 1500000 },
        'Past 6 months': { totalOrders: 800, deliveredOrders: 700, cancelledOrders: 20, incompleteOrders: 80, revenue: 750000 },
    };

    // Extracting relevant data for the selected time period
    const selectedData = orderData[timePeriod];

    return (
        <div className="mx-auto max-w-7xl px-5 py-12 rounded-lg shadow-xl shadow-black/30 border border-gray-900 bg-black/15">
            <div className="flex max-md:flex-col md:justify-between items-center py-3 mb-2 border-y border-y-gray-700">
                <h1 className="text-3xl font-semibold text-white max-md:mb-3">Order Overview</h1>
                <div className="flex space-x-4">
                    {/* Toggle buttons for time periods */}
                    {['Last 7 days', 'Last 30 days', 'Past 6 months', 'All-time'].map((period) => (
                        <button
                            key={period}
                            className={`text-gray-400 ${timePeriod === period ? 'text-teal-500 font-semibold ' : ''}`}
                            onClick={() => setTimePeriod(period)}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-cener">
                <div className="p-6 rounded-lg bg-black/15 shadow-lg shadow-black/20 ">
                    <p className="text-sm text-gray-400">Total Orders</p>
                    <h3 className="text-3xl font-bold text-white">{selectedData.totalOrders}</h3>
                </div>
                <div className="p-6 rounded-lg bg-black/15 shadow-lg shadow-black/20 ">
                    <p className="text-sm text-gray-400">Orders Delivered</p>
                    <h3 className="text-3xl font-bold text-white">{selectedData.deliveredOrders}</h3>
                </div>
                <div className="p-6 rounded-lg bg-black/15 shadow-lg shadow-black/20 ">
                    <p className="text-sm text-gray-400">Orders Cancelled</p>
                    <h3 className="text-3xl font-bold text-white">{selectedData.cancelledOrders}</h3>
                </div>
                <div className="p-6 rounded-lg bg-black/15 shadow-lg shadow-black/20 ">
                    <p className="text-sm text-gray-400">Orders Incomplete</p>
                    <h3 className="text-3xl font-bold text-white">{selectedData.incompleteOrders}</h3>
                </div>
            </div>

            {/* Total Revenue */}
            <div className="mt-2 py-2 border-y border-y-gray-700">
                <p className="text-xl font-medium text-white flex max-md:justify-center">
                    Total Revenue = ₹{selectedData.revenue}
                </p>
            </div>

            {/* Empty Space for Future Additions */}
            <div className="mt-8">
                {/* Reserved for future sections like recent activity */}
            </div>
        </div>
    );
}

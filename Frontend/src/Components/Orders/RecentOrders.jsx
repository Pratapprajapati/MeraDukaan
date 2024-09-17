import React, { useState } from 'react';
import { Clock, XCircle, CheckCircle, AlertTriangle, PackageCheck, Truck } from 'lucide-react';

const orderStatuses = {
    "Pending": { icon: <Clock className="h-5 w-5" />, color: "text-yellow-500" },
    "Cancelled": { icon: <XCircle className="h-5 w-5" />, color: "text-red-500" },
    "Accepted": { icon: <CheckCircle className="h-5 w-5" />, color: "text-green-500" },
    "Rejected": { icon: <XCircle className="h-5 w-5" />, color: "text-red-500" },
    "Incomplete": { icon: <AlertTriangle className="h-5 w-5" />, color: "text-orange-500" },
    "Delivered": { icon: <PackageCheck className="h-5 w-5" />, color: "text-green-500" },
    "Failed": { icon: <XCircle className="h-5 w-5" />, color: "text-red-500" },
    "Processing": { icon: <Truck className="h-5 w-5" />, color: "text-blue-500" },
};

const sampleOrders = [
    {
        id: 1,
        shopName: "Fresh Mart",
        shopAddress: "123 Main St, Anytown, USA",
        products: [
            { name: "Apples", price: "$2.99" },
            { name: "Milk", price: "$3.50" },
            { name: "Bread", price: "$2.00" },
        ],
        total: "$8.49",
        status: "Delivered",
        placedAt: "2023-09-15T14:30:00Z"
    },
    {
        id: 2,
        shopName: "Quick Bites",
        shopAddress: "456 Oak Ave, Another City, USA",
        products: [
            { name: "Sandwich", price: "$5.99" },
            { name: "Soda", price: "$1.50" },
        ],
        total: "$7.49",
        status: "Processing",
        placedAt: "2023-09-16T12:15:00Z"
    },
    {
        id: 3,
        shopName: "Grocery World",
        shopAddress: "789 Pine St, Somewhere, USA",
        products: [
            { name: "Chicken", price: "$8.99" },
            { name: "Rice", price: "$3.99" },
            { name: "Vegetables", price: "$4.50" },
            { name: "Sauce", price: "$2.00" },
        ],
        total: "$19.48",
        status: "Pending",
        placedAt: "2023-09-17T09:45:00Z"
    },
];

export default function RecentOrders() {
    const [selectedStatus, setSelectedStatus] = useState('All');

    const filteredOrders = selectedStatus === 'All'
        ? sampleOrders
        : sampleOrders.filter(order => order.status === selectedStatus);

    const handleCardClick = (orderId) => {
        console.log('Clicked order:', orderId);
        // Implement your order details logic here
    };

    return (
        <div className="p-4 bg-black/20 shadow-2xl shadow-black min-h-screen text-white rounded-lg">
            <div className='flex max-sm:flex-col sm:justify-between'>
                <h1 className="text-3xl font-bold mb-6">Recent Orders</h1>

                <div className='mb-6'>
                    <select
                        className="w-full md:w-auto text-md rounded-lg font-medium cursor-pointer bg-gray-800 text-white py-3 border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        {Object.keys(orderStatuses).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="space-y-4">
                {filteredOrders.map(order => (
                    <div
                        key={order.id}
                        onClick={() => handleCardClick(order.id)}
                        className="flex flex-col bg-gray-800 shadow-lg shadow-black/40 overflow-hidden rounded-lg md:flex-row border border-gray-800 cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                        <div className="w-full md:w-2/5 py-3 px-4 md:border-r border-gray-600 my-3">
                            <div className="flex flex-col space-y-1.5 -my-3">
                                <div className="flex justify-between items-center">
                                    <p className='text-2xl font-bold text-yellow-500'>{order.shopName}</p>
                                    <div className={`flex items-center ${orderStatuses[order.status].color}`}>
                                        {orderStatuses[order.status].icon}
                                        <span className="ml-1">{order.status}</span>
                                    </div>
                                </div>
                                <p className="text-md text-gray-400 line-clamp-2"><span className="font-semibold">Address:</span> {order.shopAddress}</p>
                                <p className="text-sm text-gray-400">
                                    <span className="font-semibold">Placed at:</span> {new Date(order.placedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="w-full md:w-3/5 py-3 px-4 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                                <ul className="mt-4 text-sm font-medium text-gray-400 list-disc list-inside">
                                    {order.products.slice(0, 2).map((product, index) => (
                                        <li key={index} className='truncate'>
                                            {product.name} - {product.price}
                                        </li>
                                    ))}
                                    {order.products.length > 2 && (
                                        <li>...and {order.products.length - 2} other items</li>
                                    )}
                                </ul>
                            </div>
                            <div className="md:mt-4">
                                <hr className="my-2 border-t border-gray-600" />
                                <div className="text-right">
                                    <h3 className="text-2xl font-bold">Total: <span className="text-yellow-500">{order.total}</span></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
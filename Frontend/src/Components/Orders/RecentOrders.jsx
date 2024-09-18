import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';
import { orderStatuses } from './ViewOrder';
import { recentOrders } from '../Listings/sampleData';

export default function RecentOrders() {
    const [selectedStatus, setSelectedStatus] = useState('All');
    
    const customer = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        customer.userType != "customer" ? navigate(-1) : null
        setLoading(false)
    })

    const filteredOrders = selectedStatus === 'All'
    ? recentOrders
    : recentOrders.filter(order => order.status === selectedStatus);
    
    const handleCardClick = (orderId) => {
        console.log('Clicked order:', orderId);
        // Implement your order details logic here
    };
    
    if (loading) return <Loading />;

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
                                    <div className={`flex items-center text-${orderStatuses[order.status].color}`}>
                                        {orderStatuses[order.status].icon}
                                        <span className="ml-2">{order.status}</span>
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
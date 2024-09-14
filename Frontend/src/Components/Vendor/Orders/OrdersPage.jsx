import { Ban, Clock, PackageCheck, Truck } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../../Listings/sampleData';

const orderIcons = {
    "Pending": <Clock className='inline-flex ms-2 my-1'/>,
    "Accepted": <Truck className='inline-flex ms-2 my-1'/>,
    "Rejected": <Ban className='inline-flex ms-2 my-1'/>,
    "Delivered": <PackageCheck className='inline-flex ms-2 my-1'/>
}

export default function Overview() {
    const [selectedStatus, setSelectedStatus] = useState('Pending');

    const filteredOrders = orders.filter(order => order.status === selectedStatus);

    return (
        <div className="bg-black/30 text-white p-4 rounded-md flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center text-left mb-6">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">Orders overview</h2>
                <div className="flex flex-wrap gap-2">
                    {['Pending', 'Accepted', 'Rejected', 'Delivered'].map(status => (
                        <button
                            key={status}
                            className={`px-3 py-1 rounded-lg text-sm ${selectedStatus === status ? 'bg-blue-600' : 'bg-gray-700'}`}
                            onClick={() => setSelectedStatus(status)}
                        >
                            {status}{orderIcons[status]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2">
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="flex flex-col bg-gray-800 shadow-lg shadow-black/40 overflow-hidden rounded-lg border border-gray-700">
                            <div className="w-full py-3 px-4">
                                <div className="flex flex-col space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <p className='text-xl font-bold text-yellow-500'>Order ID: {order.id}</p>
                                        {orderIcons[order.status]}
                                    </div>
                                    <div className="text-lg font-bold text-gray-300">{order.customer.name}</div>
                                    <p className="text-sm text-gray-400 line-clamp-1"><span className="font-semibold">Address:</span> {order.customer.address}</p>
                                    <p className="text-sm text-gray-400"><span className="font-semibold">Order Time:</span> 12:40 am</p>
                                </div>
                            </div>
                            <div className="flex-1 px-4 py-3 flex flex-col justify-between bg-gray-700/50">
                                <div>
                                    <h3 className="text-md font-semibold mb-2">Cart Items</h3>
                                    <ul className="text-sm text-gray-400 list-disc list-inside">
                                        {order.products.slice(0, 2).map((product, index) => (
                                            <li key={index}>
                                                {product.name} - {product.price}
                                            </li>
                                        ))}
                                        {order.products.length > 2 && (
                                            <li>...and {order.products.length - 2} other items</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <hr className="my-2 border-t border-gray-600" />
                                    <div className='flex flex-col sm:flex-row justify-between items-center'>
                                        <div className="text-lg font-medium text-black mb-2 sm:mb-0">
                                            <Link to={"/vendor/order"} className='bg-yellow-600 w-full sm:w-auto font-semibold px-5 py-2 rounded-md transform hover:scale-95 transition-transform inline-block text-center'>
                                                View Order
                                            </Link>
                                        </div>
                                        <div className="text-right">
                                            <h3 className="text-xl font-bold">Total: <span className="text-yellow-500">{order.total}</span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
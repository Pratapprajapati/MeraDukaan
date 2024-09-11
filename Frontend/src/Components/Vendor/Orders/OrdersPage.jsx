import { Ban, Clock, PackageCheck, Truck } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../../Listings/sampleData';

const orderIcons = {
    "Pending": <Clock className='inline-flex ms-2 my-1'/> ,
    "Out for delivery": <Truck className='inline-flex ms-2 my-1'/> ,
    "Cancelled": <Ban className='inline-flex ms-2 my-1'/> ,
    "Completed": <PackageCheck className='inline-flex ms-2 my-1'/>
}

export default function Orders() {
    const [selectedStatus, setSelectedStatus] = useState('Pending');

    const filteredOrders = orders.filter(order => order.status === selectedStatus);

    return (
        <div className="bg-black/30 text-white p-6 rounded-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Orders</h2>
                <div className="flex space-x-4">
                    {['Pending', 'Cancelled', 'Completed'].map(status => (
                        <button
                            key={status}
                            className={`px-4 py-2 rounded-lg ${selectedStatus === status ? 'bg-blue-600' : 'bg-gray-700'}`}
                            onClick={() => setSelectedStatus(status)}
                        >
                            {status}{orderIcons[status]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="flex flex-col bg-gray-800 shadow-lg shadow-black/40 overflow-hidden rounded-lg md:flex-row border border-gray-800">
                        <div className="w-full md:w-2/6 md:border-r border-gray-700 py-3 px-4">
                            <div className="flex flex-col space-y-1.5">
                                <div className="flex justify-between">
                                    <p className='text-2xl font-bold text-yellow-500'>Order ID: {order.id}</p>
                                    {orderIcons[order.status]}
                                </div>
                                <div className="text-xl font-bold text-gray-300">{order.customer.name}</div>
                                <p className="text-md text-gray-400 line-clamp-1"><span className="font-semibold">Address:</span> {order.customer.address}</p>
                                {order.customer.note && (
                                    <p className="text-md text-gray-400 line-clamp-1"><span className="font-semibold">Note: </span>{order.customer.note}</p>
                                )}
                                <p className="text-md text-gray-400"><span className="font-semibold">Order Time:</span>12:40 am</p>
                            </div>
                        </div>
                        <div className="flex-1 px-2 py-1.5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
                                <ul className="mt-4 text-sm font-medium text-gray-400 list-disc list-inside">
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
                                <div className='flex justify-between'>
                                    <div className="text-lg font-medium text-black flex justify-center">
                                        <Link to={"/vendor/order"} className='bg-yellow-600 w-64 font-semibold px-5 py-2 rounded-md transform hover:scale-90 transition-transform'>
                                            View Order
                                        </Link>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl font-bold">Total: <span className="text-yellow-500">{order.total}</span></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { Ban, Clock, PackageCheck, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { orders } from '../Listings/sampleData';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';

const orderIcons = {
    "Pending": <Clock className='inline-flex ms-2 my-1' />,
    "Accepted": <Truck className='inline-flex ms-2 my-1' />,
    "Rejected": <Ban className='inline-flex ms-2 my-1' />,
    "Delivered": <PackageCheck className='inline-flex ms-2 my-1' />
}

export default function Overview() {
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const filteredOrders = orders.filter(order => order.status === selectedStatus);

    const vendor = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        vendor.userType != "vendor" ? navigate(-1) : null
        setLoading(false)
    })

    const handleCardClick = (orderId) => {
        navigate(`/vendor/order/`);
    };

    if (loading) return <Loading />

    return (
        <div className="bg-black/30 text-white p-4 rounded-md flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center text-left mb-6">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">Orders overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-sm:mx-auto max-md:w-full">
                    {['Pending', 'Accepted', 'Rejected', 'Delivered'].map(status => (
                        <button
                            key={status}
                            className={`px-3 py-1 rounded-lg text-sm w-full ${selectedStatus === status ? 'bg-blue-600' : 'bg-gray-700'}`}
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
                        <div
                            key={order.id}
                            onClick={() => handleCardClick(order.id)}
                            className="flex flex-col bg-gray-800 shadow-lg shadow-black/40 overflow-hidden rounded-lg md:flex-row border border-gray-800 cursor-pointer hover:bg-gray-700 transition-colors"
                        >
                            {/* First half of the card (left side) */}
                            <div className="w-full md:w-2/5 py-3 px-4 md:border-r border-gray-600 my-3 ">
                                <div className="flex flex-col space-y-1.5 -my-3">
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

                            {/* Second half of the card (right side) */}
                            <div className="w-full md:w-3/5 py-3 px-4 flex flex-col justify-between">
                                <div className='max-md:hidden'>
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
        </div>
    );
}

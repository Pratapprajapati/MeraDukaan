import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';
import { Clock, Truck, Ban, PackageCheck, XCircle } from 'lucide-react';
import { orderStatuses } from './ViewOrder';

const orderIcons = {
    "pending": <Clock className='inline-flex ms-2 my-1' />,
    "accepted": <Truck className='inline-flex ms-2 my-1' />,
    "rejected": <Ban className='inline-flex ms-2 my-1' />,
    "delivered": <PackageCheck className='inline-flex ms-2 my-1' />,
    "cancelled": <XCircle className='inline-flex ms-2 my-1' />
};

export default function RecentOrders() {
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [orders, setOrders] = useState([]);
    const customer = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (customer.userType !== "customer") {
            navigate(-1);
            return;
        }

        setLoading(true);
        setOrders([]);
        const statusParam = selectedStatus === 'All' ? 'all' : `/${selectedStatus.toLowerCase()}`;
        axios.get(`/api/order/today/${statusParam}`)
            .then(res => {
                setOrders(res.data.data);
                setLoading(false);
            })
            .catch(e => {
                console.error(e.response.data);
                setLoading(false);
            });
    }, [selectedStatus, customer.userType, navigate]);

    const handleCardClick = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    if (loading) return <Loading />;

    return (
        <div className="p-4 bg-black/20 shadow-2xl shadow-black min-h-screen text-white rounded-lg">
            <div className='flex max-sm:flex-col sm:justify-between mb-6'>
                <div>
                    <h1 className="text-3xl font-bold ">Recent Orders</h1>
                    <p className='tex-sm text-gray-400'>Orders from past 2 days</p>
                </div>
                <div className=''>
                    <select
                        className="w-full md:w-auto text-md rounded-lg font-medium cursor-pointer bg-gray-800 text-white py-3 border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        {Object.keys(orderStatuses).map(status => (
                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className='flex justify-center items-center mt-10 text-2xl'>
                        You have no {selectedStatus.toLowerCase()} orders
                    </div>
                ) : (
                    orders.map(order => (
                        <div
                            key={order._id}
                            onClick={() => navigate(`/order/details/${order._id}`)}
                            className="flex flex-col bg-gray-800 shadow-lg shadow-black/40 overflow-hidden rounded-lg md:flex-row border border-gray-800 cursor-pointer hover:bg-gray-700 transition-colors"
                        >
                            <div className="w-full md:w-2/5 py-3 px-4 md:border-r border-gray-600 my-3">
                                <div className="flex flex-col space-y-1.5 -my-3">
                                    <div className="flex justify-between">
                                        <p className='text-2xl font-bold text-yellow-500'>Order ID: {order._id.slice(-6)}</p>
                                        <div className={`flex items-center text-${orderStatuses[order.orderStatus].color}`}>
                                            {orderStatuses[order.orderStatus].icon}
                                            <span className="ml-2">{order.orderStatus}</span>
                                        </div>
                                    </div>
                                    <div className="text-xl font-bold text-gray-300">{order.vendor.shopName}</div>
                                    <p className="text-md text-gray-400 line-clamp-1"><span className="font-semibold">Address:</span> {order.vendor.location.address}, {order.vendor.location.area}</p>
                                    <p className="text-md text-gray-400 tracking-normal"><span className="font-semibold">Order Time:</span>  {new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="w-full md:w-3/5 py-3 px-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                                    <ul className="mt-4 text-sm font-medium text-gray-400 list-disc list-inside">
                                        {order.orderItems.slice(0, 2).map((item, index) => (
                                            <li key={index} className='truncate'>
                                                {item.productName || item.product} - Qty: {item.count}, Total: ${item.total}
                                            </li>
                                        ))}
                                        {order.orderItems.length > 2 && (
                                            <li>...and {order.orderItems.length - 2} other items</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="md:mt-4">
                                    <hr className="my-2 border-t border-gray-600" />
                                    <div className="text-right">
                                        <h3 className="text-2xl font-bold">Total: <span className="text-yellow-500">₹{order.bill}</span></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
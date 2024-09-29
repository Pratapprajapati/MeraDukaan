import { Ban, Clock, PackageCheck, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';

const orderIcons = {
    "pending": <Clock className='inline-flex ms-2 my-1' />,
    "accepted": <Truck className='inline-flex ms-2 my-1' />,
    "rejected": <Ban className='inline-flex ms-2 my-1' />,
    "delivered": <PackageCheck className='inline-flex ms-2 my-1' />
}

export default function Overview() {
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const [orders, setOrders] = useState([]);

    const vendor = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (vendor.userType !== "vendor") {
            navigate(-1);
            return;
        }
        setOrders([])
        axios.get(`/api/order/today/${selectedStatus}`)
            .then(res => {
                setOrders(res.data.data);
                setLoading(false);
            })
            .catch(e => {
                console.error(e.response.data);
                setLoading(false);
            });
    }, [selectedStatus]);


    return (
        <div className="bg-black/30 text-white p-4 rounded-md flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center text-left mb-6">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">Orders overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-sm:mx-auto max-md:w-full">
                    {['pending', 'accepted', 'rejected', 'delivered'].map(status => (
                        <button
                            key={status}
                            className={`px-3 py-1 rounded-lg text-sm w-full ${selectedStatus === status ? 'bg-blue-600' : 'bg-gray-700'}`}
                            onClick={() => setSelectedStatus(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}{orderIcons[status]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2">
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className='flex justify-center items-center mt-10 text-2xl'>
                            {loading ? <Loading /> :`You have no ${selectedStatus} orders`}
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order._id}
                                onClick={() => navigate(`/vendor/order/${order._id}`)}
                                className="flex flex-col bg-gray-800 shadow-lg shadow-black/40 overflow-hidden rounded-lg md:flex-row border border-gray-800 cursor-pointer hover:bg-gray-700 transition-colors"
                            >
                                {/* First half of the card (left side) */}
                                <div className="w-full md:w-2/5 py-3 px-4 md:border-r border-gray-600 my-3 ">
                                    <div className="flex flex-col space-y-1.5 -my-3">
                                        <div className="flex justify-between">
                                            <p className='text-2xl font-bold text-yellow-500'>Order ID: {order._id.slice(-6)}</p>
                                            {orderIcons[order.orderStatus]}
                                        </div>
                                        <div className="text-xl font-bold text-gray-300">{order.customer.username}</div>
                                        <p className="text-md text-gray-400 line-clamp-1"><span className="font-semibold">Address:</span> {order.customer.location.address}, {order.customer.location.area}</p>
                                        <p className="text-md text-gray-400 tracking-normal"><span className="font-semibold">Order Time:</span>  {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>

                                {/* Second half of the card (right side) */}
                                <div className="w-full md:w-3/5 py-3 px-4 flex flex-col justify-between">
                                    <div className='max-md:hidden'>
                                        <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
                                        <ul className="mt-4 text-sm font-medium text-gray-400 list-disc list-inside">
                                            {order.orderItems.slice(0, 2).map((item, index) => (
                                                <li key={index}>
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
                        )))}
                </div>
            </div>
        </div>
    );
}
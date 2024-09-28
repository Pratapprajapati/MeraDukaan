import { useState, useEffect } from 'react';
import { CalendarClock, Filter } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';
import { orderStatuses } from './ViewOrder';

const dateRanges = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last year", days: 365 },
];

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [selectedRange, setSelectedRange] = useState(dateRanges[2].label);
    const duration = {
        "Last 7 days": "week",
        "Last 30 days": "month",
        "Last year": "year",
    };
    const [selectedStatus, setSelectedStatus] = useState("All orders");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [groupedOrders, setGroupedOrders] = useState([]);

    const user = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/order/history/${duration[selectedRange]}`)
            .then(res => {
                const data = res.data.data;
                setOrders(data);
                setLoading(false);
            })
            .catch(e => console.error(e.response.data));
    }, [selectedRange]);

    const filterOrders = (orders) => {
        let filtered = orders;

        // Status filter
        if (selectedStatus !== "All orders") {
            filtered = filtered.filter(order => order.orderStatus === selectedStatus);
        }

        return filtered;
    };

    const groupOrdersByDate = (orders) => {
        const grouped = {};
        orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(order);
        });
        return Object.entries(grouped).sort(([a], [b]) => new Date(b) - new Date(a));
    };

    useEffect(() => {
        const filtered = filterOrders(orders);
        setFilteredOrders(filtered);
        setGroupedOrders(groupOrdersByDate(filtered));
    }, [selectedRange, selectedStatus, orders]);


    return (
        <div className="bg-gray-900 text-white p-4 sm:p-6 rounded-lg flex flex-col min-h-full">
            <div className='flex max-md:flex-col justify-between'>
                <h2 className="text-2xl font-bold mb-4">Order History</h2>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <CalendarClock className="h-5 w-5 text-gray-400" />
                        <select
                            className="bg-gray-800 text-white rounded-md px-3 py-2 w-full sm:w-auto"
                            value={selectedRange}
                            onChange={(e) => setSelectedRange(e.target.value)}
                        >
                            {dateRanges.map(range => (
                                <option key={range.label} value={range.label}>{range.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                            className="bg-gray-800 text-white rounded-md px-3 py-2 w-full sm:w-auto"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="All orders">All orders</option>
                            {Object.keys(orderStatuses).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-grow">
                {filteredOrders.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        {loading ? <Loading /> : (
                            <p className="text-xl text-gray-400">No orders found for the selected filters.</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groupedOrders.map(([date, orders]) => (
                            <div key={date}>
                                <h3 className="text-lg font-semibold mb-2">{date}</h3>
                                <div className="space-y-2">
                                    {orders.map((order) => (
                                        <div key={order._id} onClick={() => navigate(user.userType == "customer" ? `/order/details/${order._id}` : `/vendor/order/${order._id}`)}
                                            className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 cursor-pointer hover:bg-gray-700 "
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-lg font-semibold">Order Id: {order._id.slice(18)}</span>
                                                <span className="text-sm text-gray-400">
                                                    {user.userType === "vendor" ? order.customer?.username || 'Unknown Customer' : order.vendor.shopName || "Unknown Shop"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                                <span className="text-sm">{order.orderItems} product{order.orderItems > 1 ? 's' : ''}</span>
                                                <span className="font-semibold">${order.bill}</span>
                                                <div className={`flex items-center capitalize text-${orderStatuses[order.orderStatus].color}`}>
                                                    {orderStatuses[order.orderStatus].icon}
                                                    <span className="ml-1 text-sm">{order.orderStatus}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

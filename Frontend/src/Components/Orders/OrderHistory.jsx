import { useState, useEffect } from 'react';
import { Clock, PackageCheck, Truck, XCircle, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { sampleOrders } from '../Listings/sampleData';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';
import { orderStatuses } from './ViewOrder';

const dateRanges = [
    { label: "Today", days: 1 },
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last year", days: 365 },
];

export default function OrderHistory() {
    const [selectedRange, setSelectedRange] = useState(dateRanges[3].label);
    const [selectedStatus, setSelectedStatus] = useState("All orders");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [groupedOrders, setGroupedOrders] = useState([]);

    const customer = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    })

    const filterOrders = (orders) => {
        let filtered = orders;

        // Date filter
        const range = dateRanges.find(range => range.label === selectedRange);
        if (range) {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - range.days);
            filtered = filtered.filter(order => new Date(order.date) >= cutoffDate);
        }

        // Status filter
        if (selectedStatus !== "All orders") {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }

        return filtered;
    };

    const groupOrdersByDate = (orders) => {
        const grouped = {};
        orders.forEach(order => {
            if (!grouped[order.date]) {
                grouped[order.date] = [];
            }
            grouped[order.date].push(order);
        });
        return Object.entries(grouped).sort(([a], [b]) => new Date(b) - new Date(a));
    };

    useEffect(() => {
        const filtered = filterOrders(sampleOrders);
        setFilteredOrders(filtered);
        setGroupedOrders(groupOrdersByDate(filtered));
    }, [selectedRange, selectedStatus]);

    if (loading) return <Loading />;

    return (
        <div className="bg-gray-900 text-white p-4 sm:p-6 rounded-lg flex flex-col min-h-full">
            <div className='flex max-md:flex-col justify-between'>
                <h2 className="text-2xl font-bold mb-4">Order History</h2>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <Filter className="h-5 w-5 text-gray-400" />
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
                        <p className="text-xl text-gray-400">No orders found for the selected filters.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groupedOrders.map(([date, orders]) => (
                            <div key={date}>
                                <h3 className="text-lg font-semibold mb-2">{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                                <div className="space-y-2">
                                    {orders.map((order) => (
                                        <div key={order.id} onClick={() => navigate("/order/details")}
                                            className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 cursor-pointer hover:border "
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-lg font-semibold">{order.id}</span>
                                                <span className="text-sm text-gray-400">{order.customerName}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                                <span className="text-sm">{order.items} product{order.items > 1 ? 's' : ''}</span>
                                                <span className="font-semibold">{order.total}</span>
                                                <div className={`flex items-center capitalize text-${orderStatuses[order.status].color}`}>
                                                    {orderStatuses[order.status].icon}
                                                    <span className="ml-1 text-sm">{order.status}</span>
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
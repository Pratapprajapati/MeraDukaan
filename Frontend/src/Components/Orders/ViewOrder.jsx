import { useState, useEffect } from 'react';
import Cart, { Total } from './Cart';
import { Clock, PackageCheck, XCircle, AlertTriangle, CheckCircle, Ban } from 'lucide-react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';
import Swal from 'sweetalert2';

export const orderStatuses = {
    "pending": { icon: <Clock className="h-5 w-5" />, color: "yellow-500" },
    "cancelled": { icon: <XCircle className="h-5 w-5" />, color: "red-500" },
    "accepted": { icon: <CheckCircle className="h-5 w-5" />, color: "green-500" },
    "rejected": { icon: <Ban className="h-5 w-5" />, color: "red-600" },
    "incomplete": { icon: <AlertTriangle className="h-5 w-5" />, color: "orange-500" },
    "delivered": { icon: <PackageCheck className="h-5 w-5" />, color: "green-500" },
    "failed": { icon: <XCircle className="h-5 w-5" />, color: "red-500" },
};

export default function Order() {
    const [orderDetails, setOrderDetails] = useState(null);
    const [customerDetails, setCustomerDetails] = useState({
        customerName: "John Doe",
        totalItems: 5,
        totalPrice: "₹7,850",
        orderStatus: "pending",
        orderNumber: "ORD12345",
        code: 23214,
        note: "Please deliver between 2-4 PM."
    });

    const params = useParams()
    const customer = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        customer.userType != "customer" ? navigate(-1) : null

        axios.get(`/api/order/view/${params.orderId}`)
            .then(res => {
                setOrderDetails(res.data.data);
            })
            .catch(e => {
                console.error(e.response.data.message)
                navigate(-1)
            })
            .finally(() => setLoading(false));
    }, [])

    const handleCancelOrder = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, Go Back',
            reverseButtons: true,
            background: '#1a1a2e',
            color: 'white'
        }).then((result) => {
            if (result.isConfirmed) {

                axios.patch(`/api/order/manage/${params.orderId}`, { orderStatus: "cancelled" })
                    .then(res => {
                        setOrderDetails({ ...orderDetails, orderStatus: "cancelled" })
                    })
                    .catch(e => console.error(e.response.data.message));
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'Your order has been cancelled.',
                    icon: 'success',
                    background: '#1a1a2e',
                    color: 'white'
                });
            }
        },);
    };


    if (loading) return <Loading />;
    if (!orderDetails) return null;

    const { vendor, orderItems, bill, code, orderStatus, description } = orderDetails;
    const vendorNote = description?.vendor || '';

    return (
        <div className="container mx-auto p-2 h-screen">
            <h1 className="text-2xl font-bold text-white mb-6">Order Number:&nbsp;
                <span className='text-yellow-500'>{params.orderId.slice(18)}</span>
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cart Items Section */}
                <Cart orderItems={orderItems} />

                {/* Customer Details Section */}
                <div className="bg-black/20 text-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
                    <div>
                        <h2 className="text-2xl font-bold text-teal-500 mb-4">Order Details</h2>
                        <div className="space-y-6">
                            <div className='space-y-4'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Shop Name:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{vendor.shopName}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Order Status:</label>
                                    <div className={`flex mt-1 items-center text-${orderStatuses[orderStatus].color}`}>
                                        {orderStatuses[orderStatus].icon}
                                        <span className="ml-2 text-lg capitalize">{orderStatus}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Shop Address:</label>
                                    <h1 className="mt-1 text-gray-200 bg-transparent line-clamp-2">
                                        {vendor.location.address + ", " + vendor.location.area}
                                    </h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Shop Contact:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{vendor.contact}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Order placed at:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">12:00 PM</h1>
                                </div>
                                {vendorNote && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Note from vendor:</label>
                                        <h1 className="mt-1 text-gray-200 bg-transparent line-clamp-2">{vendorNote}</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <Total products={orderItems.length} bill={`${bill}`} />
                        {
                            orderStatus === "pending" && (
                                <button
                                    className='w-full mt-2 bg-red-600 hover:bg-red-500 p-2 rounded-lg text-3xl capitalize text-white font-semibold text-center'
                                    onClick={handleCancelOrder}
                                >
                                    Cancel Order
                                </button>
                            )
                        }
                        {
                            orderStatus === "accepted" && (
                                <div className='w-full mt-2 bg-green-500/40 p-2 rounded-lg text-3xl capitalize text-white font-semibold text-center'>
                                    Delivery Code: {code}
                                </div>
                            )
                        }
                        {
                            !["accepted", "pending"].includes(orderStatus) && (
                                <div className={`w-full mt-2 bg-${orderStatuses[orderStatus].color} p-2 rounded-lg text-3xl capitalize text-gray-950 font-semibold text-center`}>
                                    -- {orderStatus} --
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import Cart, { Total } from './Cart';
import { cartItems } from '../Listings/sampleData';
import { Clock, PackageCheck, XCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';
import Swal from 'sweetalert2';

export const orderStatuses = {
    "pending": { icon: <Clock className="h-5 w-5" />, color: "yellow-500" },
    "cancelled": { icon: <XCircle className="h-5 w-5" />, color: "red-500" },
    "accepted": { icon: <CheckCircle className="h-5 w-5" />, color: "green-500" },
    "rejected": { icon: <XCircle className="h-5 w-5" />, color: "red-500" },
    "incomplete": { icon: <AlertTriangle className="h-5 w-5" />, color: "orange-500" },
    "delivered": { icon: <PackageCheck className="h-5 w-5" />, color: "green-500" },
    "failed": { icon: <XCircle className="h-5 w-5" />, color: "red-500" },
};

export default function Order() {
    const [customerDetails, setCustomerDetails] = useState({
        customerName: "John Doe",
        totalItems: 5,
        totalPrice: "₹7,850",
        orderStatus: "pending",
        orderNumber: "ORD12345",
        code: 23214,
        note: "Please deliver between 2-4 PM."
    });

    const customer = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        customer.userType != "customer" ? navigate(-1) : null
        setLoading(false)
    })

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
                setCustomerDetails(prev => ({ ...prev, orderStatus: 'cancelled' }));
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'Your order has been cancelled.',
                    icon: 'success',
                    background: '#1a1a2e',
                    color: 'white'
                });
            }
        });
    };


    if (loading) return <Loading />;

    return (
        <div className="container mx-auto p-2 h-screen">
            <h1 className="text-2xl font-bold text-white mb-6">Order Number:&nbsp;
                <span className='text-yellow-500'>{customerDetails.orderNumber}</span>
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cart Items Section */}
                <Cart cartItems={cartItems} />

                {/* Customer Details Section */}
                <div className="bg-black/20 text-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
                    <div>
                        <h2 className="text-2xl font-bold text-teal-500 mb-4">Order Details</h2>
                        <div className="space-y-6">
                            <div className='space-y-4'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Customer Name:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{customerDetails.customerName}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Order Status:</label>
                                    <div className={`flex mt-1 items-center text-${orderStatuses[customerDetails.orderStatus].color}`}>
                                        {orderStatuses[customerDetails.orderStatus].icon}
                                        <span className="ml-2 text-lg capitalize">{customerDetails.orderStatus}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Delivery Address:</label>
                                    <h1 className="mt-1 text-gray-200 bg-transparent line-clamp-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo esse molestiae voluptatem optio perferendis quas, quae fugit reiciendis doloremque porro, sequi repellendus modi nostrum ex explicabo ea? Architecto, totam sit.</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Shop Contact:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">98762154145</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Order placed at:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">12:00 PM</h1>
                                </div>
                                {customerDetails.note && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Note from vendor:</label>
                                        <h1 className="mt-1 text-gray-200 bg-transparent line-clamp-2">{customerDetails.note}</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <Total products={customerDetails.totalItems} bill={customerDetails.totalPrice} />
                        {
                            customerDetails.orderStatus === "pending" && (
                                <button
                                    className='w-full mt-2 bg-red-600 hover:bg-red-500 p-2 rounded-lg text-3xl capitalize text-white font-semibold text-center'
                                    onClick={handleCancelOrder}
                                >
                                    Cancel Order
                                </button>
                            )
                        }
                        {
                            customerDetails.orderStatus === "accepted" && (
                                <div className='w-full mt-2 bg-green-500/40 p-2 rounded-lg text-3xl capitalize text-white font-semibold text-center'>
                                    Delivery Code: {customerDetails.code}
                                </div>
                            )
                        }
                        {
                            !["accepted", "pending"].includes(customerDetails.orderStatus) && (
                                <div className={`w-full mt-2 bg-${orderStatuses[customerDetails.orderStatus].color} p-2 rounded-lg text-3xl capitalize text-gray-950 font-semibold text-center`}>
                                    -- {customerDetails.orderStatus} --
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
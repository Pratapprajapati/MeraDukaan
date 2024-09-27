import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Cart, { Total } from './Cart';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';

const Modal = ({ isOpen, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-2">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export const orderStatuses = {
    "pending": "yellow-500",
    "cancelled": "red-500",
    "accepted": "green-500",
    "rejected":  "red-500",
    "incomplete": "orange-500",
    "delivered":  "green-500",
    "failed": "red-500",
};

export default function Order() {
    const [orderDetails, setOrderDetails] = useState(null);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [acceptNote, setAcceptNote] = useState('');
    const [rejectNote, setRejectNote] = useState('');

    const params = useParams()
    const vendor = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (vendor.userType !== "vendor") navigate(-1);

        axios.get(`/api/order/view/${params.orderId}`)
            .then(res => {
                setOrderDetails(res.data.data);
            })
            .catch(e => {
                console.error(e.response.data.message)
                navigate(-1)
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAccept = () => {
        const data = {
            orderStatus: "accepted",
            description: acceptNote
        }
        axios.patch(`/api/order/manage/${params.orderId}`, data)
            .then(res => {
                setOrderDetails({...orderDetails, orderStatus: "accepted"})
            })
            .catch(e => console.error(e.response.data.message));

        Swal.fire({
            title: 'Order Accepted!',
            text: 'You have accepted the order.',
            icon: 'success',
            color: 'white',
            background: '#1a1a2e',
        });
        setIsAcceptModalOpen(false);
    };

    const handleReject = () => {
        if (!rejectNote) {
            Swal.fire({
                title: 'Error!',
                text: 'Please provide a reason for rejection.',
                icon: 'error',
                color: 'white',
                background: '#1a1a2e',
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to reject this order?',
            icon: 'warning',
            color: 'white',
            background: '#1a1a2e',
            showCancelButton: true,
            confirmButtonText: 'Yes, Reject!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    orderStatus: "rejected",
                    description: rejectNote
                }

                axios.patch(`/api/order/manage/${params.orderId}`, data)
                    .then(res => {
                        setOrderDetails({...orderDetails, orderStatus: "rejected"})
                    })
                    .catch(e => console.error(e.response.data.message));

                Swal.fire({
                    title: 'Order Rejected!',
                    text: 'You have rejected the order.',
                    icon: 'error',
                    color: 'white',
                    background: '#1a1a2e',
                });
                setIsRejectModalOpen(false);
            }
        });
    };

    if (loading) return <Loading />;
    if (!orderDetails) return null;

    const { customer, orderItems, bill, orderStatus, description } = orderDetails;
    const customerNote = description.customer || '';

    return (
        <div className="container mx-auto h-screen p-2">
            <h1 className="text-2xl font-bold text-white mb-6">Order Number:&nbsp;
                <span className='text-yellow-500'>{params.orderId.slice(18)}</span>
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cart Items Section */}
                <Cart orderItems={orderItems} />

                {/* Customer Details Section */}
                <div className="bg-black/20 text-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
                    <div>
                        <h2 className="text-2xl font-bold text-teal-500 mb-4">Customer Details</h2>
                        <div className="space-y-6">
                            <div className='space-y-4'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Customer Name:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{customer.username}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Order Status:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{orderStatus}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Delivery Address:</label>
                                    <h1 className="mt-1 text-gray-200 bg-transparent line-clamp-2">{customer.location.address}, {customer.location.city}, {customer.location.pincode}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Contact:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{customer.contact}</h1>
                                </div>
                                {customerNote && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Note:</label>
                                        <h1 className="mt-1 text-gray-200 bg-transparent line-clamp-2">{customerNote}</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Total products={orderItems.length} bill={`${bill}`} />
                        {
                            orderStatus === "pending" ? (
                                <div className='flex justify-between mt-6 max-sm:space-x-4'>
                                    <button
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-gray-950 text-2xl font-semibold rounded transform hover:scale-90 transition-transform"
                                        onClick={() => setIsRejectModalOpen(true)}
                                    >
                                        Reject Order
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-gray-950 text-2xl font-semibold rounded transform hover:scale-90 transition-transform"
                                        onClick={() => setIsAcceptModalOpen(true)}
                                    >
                                        Accept Order
                                    </button>
                                </div>
                            ) : (
                                <div className={`w-full mt-2 bg-${orderStatuses[orderStatus]} text-black p-2 rounded-lg text-3xl capitalize font-semibold text-center`}>
                                    -- {orderStatus} --
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            {/* Accept Modal */}
            <Modal isOpen={isAcceptModalOpen} title="Accept Order">
                <textarea
                    className="w-full p-2 text-white border rounded mb-4 resize-none"
                    rows={4}
                    placeholder="Add a note (optional)"
                    value={acceptNote}
                    onChange={(e) => setAcceptNote(e.target.value)}
                />
                <div className="flex justify-between space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-300 text-black font-semibold rounded transform hover:scale-90 transition-transform"
                        onClick={() => setIsAcceptModalOpen(false)}
                    >
                        Go Back
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-black font-semibold rounded transform hover:scale-90 transition-transform"
                        onClick={handleAccept}
                    >
                        Accept Order
                    </button>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal isOpen={isRejectModalOpen} title="Reject Order">
                <textarea
                    className="w-full p-2 text-white border rounded mb-4 resize-none"
                    rows={4}
                    placeholder="Reason for cancellation (required)"
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                />
                <div className="flex justify-between space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-300 text-black font-semibold rounded transform hover:scale-90 transition-transform"
                        onClick={() => setIsRejectModalOpen(false)}
                    >
                        Go Back
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-black font-semibold rounded transform hover:scale-90 transition-transform"
                        onClick={handleReject}
                    >
                        Reject Order
                    </button>
                </div>
            </Modal>
        </div>
    );
}


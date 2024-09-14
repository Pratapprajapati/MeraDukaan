import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { cartItems } from '../../Listings/sampleData';

const Modal = ({ isOpen, onClose, title, children }) => {
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

export default function Order() {
    const [customerDetails, setCustomerDetails] = useState({
        customerName: "John Doe",
        totalItems: 5,
        totalPrice: "₹7,850",
        orderStatus: "Pending",
        orderNumber: "ORD12345",
        note: "Please deliver between 2-4 PM."
    });

    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [acceptNote, setAcceptNote] = useState('');
    const [rejectNote, setRejectNote] = useState('');

    const handleAccept = () => {
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

    return (
        <div className="container mx-auto h-screen">
            <h1 className="text-2xl font-bold text-white mb-6">Order Number:&nbsp;
                <span className='text-yellow-500'>{customerDetails.orderNumber}</span>
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cart Items Section */}
                <div className="bg-black/20 text-gray-900 p-6 rounded-lg shadow-md flex flex-col h-full">
                    <h2 className="text-2xl font-bold text-teal-500 mb-4">Cart Items</h2>
                    <div className="flex-1 overflow-y-auto space-y-4 max-h-[500px]">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-black/20 text-gray-900 rounded-lg shadow-sm cursor-pointer">
                                <div className="flex py-6">
                                    <div className="flex-shrink-0"></div>
                                    <div className="px-5 flex flex-1 flex-col justify-between">
                                        <div className='flex justify-between items-center -mt-2'>
                                            <h3 className="text-lg font-semibold text-white">
                                                {item.name}
                                            </h3>
                                            <p className="text-lg text-yellow-400 font-medium">
                                                {item.price}
                                            </p>
                                        </div>
                                        <div className='space-y-1 mt-1'>
                                            <h1 className='text-gray-400 text-sm'>Category: Food</h1>
                                            <h1 className='text-gray-400 text-sm'>Quantity: {item.quantity}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 bg-black/30 p-4 rounded-lg">
                        <div className="flex justify-between text-xl text-white">
                            <p>Total Products: <span className='text-yellow-500'>{customerDetails.totalItems}</span></p>
                            <p>Total Bill: <span className='text-yellow-500 font-semibold'>{customerDetails.totalPrice}</span></p>
                        </div>
                    </div>
                </div>


                {/* Customer Details Section */}
                <div className="bg-black/20 text-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
                    <div>
                        <h2 className="text-2xl font-bold text-teal-500 mb-4">Customer Details</h2>
                        <div className="space-y-6">
                            <div className='space-y-4'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Customer Name:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{customerDetails.customerName}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Order Status:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{customerDetails.orderStatus}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Delivery Address:</label>
                                    <h1 className="mt-1 text-gray-200 bg-transparent line-clamp-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo esse molestiae voluptatem optio perferendis quas, quae fugit reiciendis doloremque porro, sequi repellendus modi nostrum ex explicabo ea? Architecto, totam sit.</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Contact:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">98762154145</h1>
                                </div>
                                {customerDetails.note && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Note:</label>
                                        <h1 className="mt-1 text-gray-200 bg-transparent line-clamp-2">{customerDetails.note}</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

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
                </div>

            </div>

            {/* Accept Modal */}
            <Modal isOpen={isAcceptModalOpen} onClose={() => setIsAcceptModalOpen(false)} title="Accept Order">
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
            <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Order">
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

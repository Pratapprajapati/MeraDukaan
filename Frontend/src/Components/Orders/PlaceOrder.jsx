import { useState, useEffect } from 'react';
import { MoveLeft, MoveRight, PenBox } from 'lucide-react';
import Swal from 'sweetalert2';
import { cartItems } from '../Listings/sampleData';
import Cart, { Total } from './Cart';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';


function Alert() {
    Swal.fire({
        title: 'Are you sure?',
        html: "Once the order is placed, you cannot edit your details or the contents of your Cart.<br><br>Order cannot be cancelled once placed.",
        icon: 'question',
        color: 'white',
        background: '#1a1a2e',
        showCancelButton: true,
        confirmButtonText: 'Yes, Order!',
        cancelButtonText: 'No, cancel',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // User clicked "Yes, Order!"
            Swal.fire({
                title: 'Ordered!',
                text: 'You can track your order in the orders section in your profile.',
                icon: 'success',
                color: 'white',
                background: '#1a1a2e',
            });
        }
    });
}

export default function Order() {
    const [shopDetails, setShopDetails] = useState({
        shopName: "Local Shop",
        totalItems: 5,
        totalPrice: "₹7,850",
    });
    const [note, setNote] = useState('');

    const customer = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        customer.userType != "customer" ? navigate(-1) : null
        setLoading(false)
    })

    if (loading) return <Loading />;

    return (
        <div className="container mx-auto p-1.5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cart Items Section */}
                <Cart cartItems={cartItems} />

                {/* Shop Details Section */}
                <div className="bg-black/20 text-gray-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-teal-500 mb-4">Order Details</h2>
                        <div className="space-y-6">
                            <div className="flex flex-row space-x-20">
                                <div className='space-y-4'>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Shop Name:</label>
                                        <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{shopDetails.shopName}</h1>
                                    </div>
                                    <div>
                                        <div className='flex justify-between'>
                                            <label className="block text-sm font-medium text-gray-400">Delivery Address</label>
                                            <PenBox className='inline-flex text-teal-300 cursor-pointer' onClick={() => navigate("/customer")}/>
                                        </div>
                                        <h1 className="mt-1 text-gray-200 bg-transparent line-clamp-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo esse molestiae voluptatem optio perferendis quas, quae fugit reiciendis doloremque porro, sequi repellendus modi nostrum ex explicabo ea? Architecto, totam sit.</h1>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Contact:</label>
                                        <h1 className="mt-1 text-lg text-gray-200 bg-transparent">98762154145</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Note Section */}
                        <div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-400">Leave a Note:</label>
                                <textarea
                                    rows={3}
                                    className="mt-1 w-full text-lg px-2 py-1 text-gray-200 bg-transparent border border-gray-700 rounded-lg resize-none"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    placeholder='Ex: Leave at the door'
                                />
                            </div>

                        </div>
                    </div>

                    {/* Final section moved to the bottom */}
                    <div>
                        <Total products={shopDetails.totalItems} bill={shopDetails.totalPrice} />

                        <div className='flex justify-between mt-6'>
                            <button className="px-4 py-2 bg-teal-500 text-gray-900 font-semibold rounded">
                                <MoveLeft className='inline-flex me-2' />Back to Cart
                            </button>
                            <button className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded" onClick={Alert}>
                                Place Order<MoveRight className='inline-flex ms-2' />
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
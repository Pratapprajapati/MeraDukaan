import { useState, useEffect } from 'react';
import { MoveLeft, MoveRight, PenBox, Truck, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { cartItems } from '../Listings/sampleData';
import Cart, { Total } from './Cart';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';

function Alert(isDelivery) {
    const title = isDelivery ? 'Are you sure?' : 'No Delivery Available';
    const text = isDelivery
        ? "Once the order is placed, you cannot edit your details or the contents of your Cart.<br><br>Order cannot be cancelled once it is accepted by the vendor."
        : "This shop does not offer delivery services. Please arrange pickup.";

    Swal.fire({
        title: title,
        html: text,
        icon: 'question',
        color: 'white',
        background: '#1a1a2e',
        showCancelButton: true,
        confirmButtonText: isDelivery ? 'Yes, Order!' : 'Okay',
        cancelButtonText: 'No, cancel',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed && isDelivery) {
            // User clicked "Yes, Order!"
            Swal.fire({
                title: 'Ordered!',
                text: 'You can track your order in recent orders.',
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
        delivery: false,
        totalItems: 5,
        totalPrice: "₹7,850",
    });
    const [note, setNote] = useState('');

    const customer = useOutletContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (customer.userType !== "customer") {
            navigate(-1);
        }
        setLoading(false);
    }, [customer.userType, navigate]);

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
                            <div className="flex flex-row space-x-20 w-full">
                                <div className='space-y-4 w-full'>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Shop Name:</label>
                                        <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{shopDetails.shopName}</h1>
                                        <h2 className="mt-1 text-sm text-teal-500">
                                            {shopDetails.delivery ? (
                                                <span className='text-lg text-green-500'><Truck className='inline-flex h-5 w-5' /> Offers delivery</span>
                                            ) : (
                                                <span className='text-lg text-orange-500'><X className='inline-flex h-5 w-5' /> No Home delivery</span>
                                            )}
                                        </h2>
                                    </div>
                                    {shopDetails.delivery && (
                                        <div className='w-full'>
                                            <div className='flex justify-between w-full'>
                                                <label className="block text-sm font-medium text-gray-400">Delivery Address</label>
                                                <PenBox className='inline-flex text-teal-300 cursor-pointer' onClick={() => navigate("/customer")} />
                                            </div>
                                            <h1 className="mt-1 text-gray-200 bg-transparent line-clamp-3">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, nam laudantium. Labore, laboriosam, veritatis vel nobis facere sit vitae totam mollitia, consectetur eligendi quas fugit quae minima ex ea omnis.
                                            </h1>
                                        </div>
                                    )}
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
                                <label className="block text-sm font-medium text-gray-400">Instructions for the vendor:</label>
                                <textarea
                                    rows={3}
                                    className="mt-1 w-full text-lg px-2 py-1 text-gray-200 bg-transparent border border-gray-700 rounded-lg resize-none"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    placeholder={shopDetails.delivery ? 'Ex: Leave at the door' : 'Ex: Pickup by 5pm'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Final section moved to the bottom */}
                    <div>
                        <Total products={shopDetails.totalItems} bill={shopDetails.totalPrice} />

                        <div className='flex justify-between mt-6'>
                            <button className="px-4 py-2 bg-teal-500 text-gray-900 font-semibold rounded" onClick={() => navigate("/cart")}>
                                <MoveLeft className='inline-flex me-2' />Back to Cart
                            </button>
                            <button className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded" onClick={() => Alert(shopDetails.delivery)}>
                                Place Order<MoveRight className='inline-flex ms-2' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

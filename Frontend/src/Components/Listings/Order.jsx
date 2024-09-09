import { useState } from 'react';
import { MoveLeft, MoveRight, Trash } from 'lucide-react';
import Swal from 'sweetalert2';

const cartItems = [
    {
        id: 1,
        name: 'Product 1',
        color: 'Red',
        size: 'L',
        originalPrice: '₹1,999',
        price: '₹1,499',
        discount: '25% off',
        quantity: 2,
        imageSrc: '/path/to/image1.jpg',
    },
    {
        id: 2,
        name: 'Product 2',
        color: 'Blue',
        size: 'M',
        originalPrice: '₹2,499',
        price: '₹1,999',
        discount: '20% off',
        quantity: 1,
        imageSrc: '/path/to/image2.jpg',
    },
    {
        id: 3,
        name: 'Product 1',
        color: 'Red',
        size: 'L',
        originalPrice: '₹1,999',
        price: '₹1,499',
        discount: '25% off',
        quantity: 2,
        imageSrc: '/path/to/image1.jpg',
    },
    {
        id: 4,
        name: 'Product 2',
        color: 'Blue',
        size: 'M',
        originalPrice: '₹2,499',
        price: '₹1,999',
        discount: '20% off',
        quantity: 1,
        imageSrc: '/path/to/image2.jpg',
    },
    {
        id: 5,
        name: 'Product 2',
        color: 'Blue',
        size: 'M',
        originalPrice: '₹2,499',
        price: '₹1,999',
        discount: '20% off',
        quantity: 1,
        imageSrc: '/path/to/image2.jpg',
    },
    // Add more cart items as needed
];

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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash');

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Shop Details Section */}
                <div className="bg-black/10 text-gray-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-teal-500 mb-4">Shop Details</h2>
                    <div className="space-y-6">
                        <div className="flex flex-row space-x-20">
                            <div className='space-y-4'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Shop Name:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{shopDetails.shopName}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Total Items:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{shopDetails.totalItems}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Total Price:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{shopDetails.totalPrice}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Delivery Address</label>
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
                    {/* Payment section */}
                    <div className="mt-4 grid xl:grid-cols-2 mb-1">
                        <div className='py-3'>
                            <label className="block text-sm font-medium text-gray-400">Payment Method:</label>
                            <div className="flex space-x-4 mt-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Cash"
                                        checked={selectedPaymentMethod === 'Cash'}
                                        onChange={() => setSelectedPaymentMethod('Cash')}
                                        className="form-radio w-5 h-5 cursor-pointer"
                                    />
                                    <span className="text-gray-200">Cash</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Card"
                                        checked={selectedPaymentMethod === 'Card'}
                                        onChange={() => setSelectedPaymentMethod('Card')}
                                        className="form-radio w-5 h-5 cursor-pointer"
                                    />
                                    <span className="text-gray-200">Card</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Online"
                                        checked={selectedPaymentMethod === 'Online'}
                                        onChange={() => setSelectedPaymentMethod('Online')}
                                        className=" w-5 h-5 cursor-pointer text-teal-500 border-gray-500 focus:ring-teal-500"
                                    />
                                    <span className="text-gray-200">Online</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            {(selectedPaymentMethod === 'Card' || selectedPaymentMethod === 'Online') && (
                                <div className="mt-2 xl:ml-4 grid items-center max-xl:space-y-2 text-left">
                                    <label className="block text-sm font-medium text-gray-400">Transaction Image:</label>

                                    <input
                                        type="file" required
                                        className="text-sm w-64 text-gray-200 bg-transparent border border-gray-500 rounded-md p-2"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex justify-between'>
                        <button className="mt-4 px-4 py-2 bg-teal-500 text-gray-900 font-semibold rounded">
                            <MoveLeft className='inline-flex me-2' />Back to Cart
                        </button>
                        <button className="mt-4 px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded" onClick={Alert}>
                            Place Order<MoveRight className='inline-flex ms-2' />
                        </button>
                    </div>
                </div>

                {/* Cart Items Section */}
                <div className="bg-black/10 text-gray-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-teal-500 mb-4">Cart Items</h2>
                    <div className="max-h-[600px] overflow-y-auto space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-black/20 text-gray-900  rounded-lg shadow-sm cursor-pointer">
                                <div className="flex py-6">
                                    <div className="flex-shrink-0">
                                    </div>
                                    <div className="px-5 flex flex-1 flex-col justify-between">
                                        <div className='flex justify-between items-center -mt-2'>
                                            <h3 className="text-lg font-semibold text-white">
                                                {item.name}
                                            </h3>
                                            <p className="text-lg text-yellow-400 font-medium">
                                                {item.price}
                                            </p>
                                        </div>
                                        <h1 className='text-gray-400 text-sm mb-2'>Category: Food</h1>
                                        <div className="mt-2 flex">
                                            <div className="min-w-24 flex">
                                                <button type="button" className="h-7 w-7 bg-gray-700 text-white rounded-md">-</button>
                                                <input disabled
                                                    type="text"
                                                    className="mx-1 h-7 w-9 rounded-md border-gray-700 bg-gray-800 text-center text-white"
                                                    defaultValue={item.quantity}
                                                />
                                                <button type="button" className="h-7 w-7 bg-gray-700 text-white rounded-md">+</button>
                                            </div>
                                            <div className="ml-6 flex text-sm">
                                                <button type="button" className="flex items-center space-x-1 px-2 py-1">
                                                    <Trash size={12} className="text-red-400" />
                                                    <span className="text-xs font-medium text-red-400">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

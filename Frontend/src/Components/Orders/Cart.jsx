import React, { useState } from 'react';
import { Trash, Edit2, Save } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export function Total({ products, bill }) {
    return (
        <div className="mt-3 bg-black/30 p-4 rounded-lg">
            <div className="flex justify-between text-xl text-white">
                <p>Total Products: <span className='text-yellow-500'>{products}</span></p>
                <p>Total Bill: <span className='text-yellow-500 font-semibold tracking-widest'>₹{bill}</span></p>
            </div>
        </div>
    );
}

export default function Cart({ orderItems = [], vendor = "" }) {
    const path = useLocation();
    const place = path.pathname.includes("place");
    const [editingItem, setEditingItem] = useState(null);
    const [editCount, setEditCount] = useState(0);
    const [originalCount, setOriginalCount] = useState(0); // Keep track of the original count

    const addToCart = (productId, count) => {
        const productDetails = {
            productId: productId,
            vendorId: vendor,
            count: count
        };

        axios.post(`/api/customer/cart/add`, productDetails)
            .then(res => {
                orderItems.find(item => item.product._id === productId).count = count;
                setEditingItem(null); // Exit edit mode
            })
            .catch(e => console.error(e.response.data.message));
    };

    const removeFromCart = (productId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to remove this product from your cart?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!',
            background: '#1a1a2e',
            color: 'white',
        }).then((result) => {
            if (result.isConfirmed) {
                const productDetails = {
                    product: productId,
                    vendor: vendor,
                };

                axios.post(`/api/customer/cart/remove`, productDetails)
                    .then(res => {
                        Swal.fire({
                            title: 'Product removed!',
                            text: 'Product has been removed from your cart.',
                            icon: 'success',
                            background: '#1a1a2e',
                            color: 'white',
                            timer: 1000
                        });
                        // Remove product from orderItems
                        const index = orderItems.findIndex(item => item.product._id === productId);
                        if (index !== -1) orderItems.splice(index, 1);
                    })
                    .catch(e => console.error(e.response.data.message));
            }
        });
    };

    const handleEdit = (item) => {
        setEditingItem(item.product._id);
        setEditCount(item.count);
        setOriginalCount(item.count); // Store original count
    };

    const handleSave = (productId) => {
        // Only make the API call if the count has changed
        if (editCount !== originalCount) {
            addToCart(productId, editCount);
        } else {
            setEditingItem(null); // Exit edit mode without API call
        }
    };

    const handleIncrement = () => setEditCount(prev => prev + 1);
    const handleDecrement = () => setEditCount(prev => prev > 1 ? prev - 1 : 1);

    return (
        <div className="bg-black/20 text-gray-900 max-sm:p-2 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-teal-500 mb-4">Cart Items</h2>
            <div className="max-h-[600px] overflow-y-auto space-y-4">
                {orderItems.length > 0 ? (
                    orderItems.map((item) => (
                        <div key={item.product._id} className="bg-black/20 text-gray-900 rounded-lg shadow-sm cursor-pointer">
                            <div className="flex py-4 ps-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="h-16 w-16 object-cover rounded-md"
                                    />
                                </div>
                                <div className="px-5 flex flex-1 flex-col justify-between">
                                    <div className='flex justify-between items-center -mt-2'>
                                        <h3 className="text-lg font-semibold text-white">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-lg text-white font-medium">
                                            <span className='tracking-widest text-yellow-400'>
                                                ₹{place ? (item.price * item.count) : (item.total / item.count)}
                                            </span>
                                        </p>
                                    </div>
                                    <h1 className='text-gray-400 text-sm mb-1'>Category: {item.product.subCategory}</h1>
                                    {
                                        place ? (
                                            editingItem === item.product._id ? (
                                                <div className="mt-2 flex justify-between items-center max-sm:flex-col max-sm:space-y-3">
                                                    <div className="flex items-center">
                                                        <button onClick={handleDecrement} className="h-7 w-7 text-2xl bg-gray-700 text-white rounded-md">-</button>
                                                        <input
                                                            type="text"
                                                            className="mx-1 h-7 w-9 rounded-md border-gray-700 bg-gray-800 text-center text-white"
                                                            value={editCount}
                                                            readOnly
                                                        />
                                                        <button onClick={handleIncrement} className="h-7 w-7 text-2xl bg-gray-700 text-white rounded-md">+</button>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <button onClick={() => removeFromCart(item.product._id, item.product.name)} className="flex items-center space-x-1 px-2 py-1 bg-red-600 rounded-md">
                                                            <Trash size={12} className="text-white" />
                                                            <span className="text-xs font-medium text-white">Remove</span>
                                                        </button>
                                                        <button onClick={() => handleSave(item.product._id)} className="flex items-center space-x-1 px-2 py-1 bg-green-600 rounded-md">
                                                            <Save size={12} className="text-white" />
                                                            <span className="text-xs font-medium text-white">Save</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-2 flex justify-between items-center">
                                                    <h1 className='text-gray-400 text-sm'>Quantity: <span className='text-lg text-white'>{item.count}</span></h1>
                                                    <button onClick={() => handleEdit(item)} className="flex items-center space-x-1 px-2 py-1 bg-blue-600 rounded-md">
                                                        <Edit2 size={12} className="text-white" />
                                                        <span className="text-xs font-medium text-white">Edit</span>
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            <h1 className='text-gray-400 text-sm'>Quantity: <span className='text-lg text-white'>{item.count}</span></h1>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No items in the cart.</p>
                )}
            </div>
        </div>
    );
}

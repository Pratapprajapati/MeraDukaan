import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddToCartModal = ({ isOpen, onClose, product, vendor, updateCart }) => {
    const [count, setCount] = useState(product?.cartCount || 1);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setCount(product?.cartCount || 1);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, product]);

    const addToCart = () => {
        const productDetails = {
            productId: product.product._id,
            vendorId: vendor,
            count: count
        }
        axios.post(`/api/customer/cart/add`, productDetails)
            .then(res => {
                updateCart(product.product._id, count);
                onClose();
            })
            .catch(e => console.error(e.response.data.message));
    }

    const removeFromCart = () => {
        const productDetails = {
            product: product.product._id,
            vendor: vendor,
        }
        console.log(productDetails)
        axios.post(`/api/customer/cart/remove`, productDetails)
            .then(res => {
                Swal.fire({
                    title: 'Product removed from your cart!',
                    text: 'You can always add it back.',
                    icon: 'success',
                    color: 'white',
                    timer:1000,
                    background: '#1a1a2e',
                });
                updateCart(product.product._id, 0); // Update local state to reflect removal
                onClose();
            })
            .catch(e => console.error(e.response.data.message));
    }

    const handleIncrement = () => setCount(prev => prev < 13 ? prev + 1 : 13);
    const handleDecrement = () => setCount(prev => prev > 1 ? prev - 1 : 1);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">
                        {product?.cartCount > 0 ? 'Update Cart' : 'Add to Cart'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-4">
                    <div className="flex flex-col  gap-4">
                        <div className="w-full  flex items-center justify-center">
                            <img src={product.product.image} alt={product.product.name} className="w-full h-auto max-w-96 max-h-96 object-cover rounded-md" />
                        </div>
                        <div className="w-full ">
                            <h3 className="text-2xl font-semibold text-white">{product.product.name}</h3>
                            <p className="text-md text-gray-400">{product.product.subCategory}</p>
                            <p className="mt-2 text-gray-300">{product.description || "No product description"}</p>
                            <p className="text-lg font-semibold mt-2 text-yellow-500 tracking-widest">₹{product.price}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4 mt-4">
                        <button onClick={handleDecrement} className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600">
                            <Minus size={20} />
                        </button>
                        <span className="text-xl font-semibold text-white">{count}</span>
                        <button onClick={handleIncrement} className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
                <div className="flex justify-between space-x-2 p-4 border-t border-gray-700">
                    {product?.cartCount > 0 && (
                        <button onClick={removeFromCart} className="px-4 py-2 w-full bg-red-500 text-white font-semibold rounded hover:bg-red-600">
                            Remove from Cart
                        </button>
                    )}
                    <button onClick={addToCart} className="px-4 py-2 bg-teal-500 w-full text-black font-semibold rounded hover:bg-teal-600">
                        {product?.cartCount > 0 ? 'Update Cart' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddToCartModal;
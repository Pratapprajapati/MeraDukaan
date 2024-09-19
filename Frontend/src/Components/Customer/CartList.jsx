import { useState, useEffect } from 'react';
import { ShoppingCart, Clock } from "lucide-react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';

const vendors = [
    {
        id: 1,
        shopName: 'Local Shop 1',
        shopAddress: '123 Market St, City, State',
        isOpen: true,
        products: [
            { name: 'Nike Air Force 1 07 LV8', price: '₹61,999' },
            { name: 'Nike Run Division, Airmax Pro Ultra Mens Runnig Shoes', price: '₹22,500' },
            { name: 'Product 3', price: '₹9,999' },
            { name: 'Product 4', price: '₹12,000' },
            { name: 'Product 5', price: '₹3,000' },
        ],
        total: '₹1,09,498',
    },
    {
        id: 2,
        shopName: 'Local Shop 2',
        shopAddress: '456 High St, City, State',
        isOpen: false,
        products: [
            { name: 'Product 1', price: '₹12,000' },
            { name: 'Product 2', price: '₹9,500' },
            { name: 'Product 3', price: '₹3,999' },
        ],
        total: '₹25,499',
    },
];

export default function Cart() {

    const customer = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        customer.userType != "customer" ? navigate(-1) : null
        setLoading(false)
    })

    if (loading) return <Loading />;

    const handleCardClick = (id) => {
        navigate("/order/place")
    };

    return (
        <div className="mx-auto my-4 max-w-7xl p-4 md:my-6 rounded-lg bg-black/20 shadow-lg shadow-black/50">
            <h2 className="text-3xl font-bold text-teal-500 flex items-end">
                <ShoppingCart className="inline-flex w-10 h-10 me-2 items-start" />Your Cart
            </h2>
            <div className="mt-3 text-gray-300">
                Your cart items are sorted according to their respective vendors
            </div>
            <div className="mt-8 flex flex-col space-y-8">
                {vendors.map((vendor) => (
                    <div
                        key={vendor.id}
                        onClick={() => handleCardClick(vendor.id)}
                        className="flex flex-col bg-gray-800 shadow-lg shadow-black/40 overflow-hidden rounded-lg md:flex-row border border-gray-800 cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                        <div className="w-full md:w-2/5 py-3 px-4 md:border-r border-gray-600 my-3 ">
                            <div className="flex flex-col space-y-1.5 -my-3">
                                <div className="flex justify-between">
                                    <p className='text-2xl font-bold text-yellow-500'>{vendor.shopName}</p>
                                    {vendor.isOpen ?
                                        <span className="text-green-500 flex items-center"><Clock className="w-4 h-4 mr-1" /> Open</span> :
                                        <span className="text-red-500 flex items-center"><Clock className="w-4 h-4 mr-1" /> Closed</span>
                                    }
                                </div>
                                <p className="text-md text-gray-400 line-clamp-2"><span className="font-semibold">Address:</span> {vendor.shopAddress}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-3/5 py-3 px-4 flex flex-col justify-between">
                            <div className=''>
                                <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
                                <ul className="mt-4 text-sm font-medium text-gray-400 list-disc list-inside">
                                    {vendor.products.slice(0, 2).map((product, index) => (
                                        <li key={index} className='truncate'>
                                            {product.name} - {product.price}
                                        </li>
                                    ))}
                                    {vendor.products.length > 2 && (
                                        <li>...and {vendor.products.length - 2} other items</li>
                                    )}
                                </ul>
                            </div>
                            <div className="md:mt-4">
                                <hr className="my-2 border-t border-gray-600" />
                                <div className="text-right">
                                    <h3 className="text-2xl font-bold">Total: <span className="text-yellow-500">{vendor.total}</span></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
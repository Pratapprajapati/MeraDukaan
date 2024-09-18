import React, { useState } from 'react';
import { Search, Info, Plus, Minus, Store, MapPin, MoveRight, ArrowRightLeft } from 'lucide-react';
import img from "../assets/img1.webp"
import { products } from './sampleData';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';

export default function Inventory() {
    const [quantities, setQuantities] = useState(Array(products.length).fill(0));

    const customer = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        customer.userType != "customer" ? navigate(-1) : null
        setLoading(false)
    })

    const handleIncrease = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;
        setQuantities(newQuantities);
    };
    
    const handleDecrease = (index) => {
        if (quantities[index] > 0) {
            const newQuantities = [...quantities];
            newQuantities[index] -= 1;
            setQuantities(newQuantities);
        }
    };
    
    if (loading) return <Loading />;

    return (
        <div className="container mx-auto mt-8">
            <div className="flex flex-col xl:flex-row xl:justify-between items-start pb-4 mx-2 border-b border-b-gray-600 max-xl:space-y-5">
                <div>
                    <h3 className="sm:text-4xl text-2xl font-bold text-yellow-500 mb-3 line-clamp-1 max-sm:line-clamp-2">
                        Shop Name: Horse Riding Company Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia illum dolorum, aspernatur distinctio iste exercitationem reiciendis laudantium consequuntur minima dolores nisi provident laborum vitae eum aliquam quidem fugit magni natus?
                    </h3>
                    <div className="flex max-sm:flex-col max-sm:space-y-3 sm:justify-between text-gray-400 font-semibold">
                        <div className='flex max-sm:flex-col max-sm:space-y-2 sm:space-x-5'>
                            <span>
                                <Store size={20} className='inline-flex me-2' />
                                Store Type: General
                            </span>
                            <span>
                                <MapPin size={20} className='inline-flex me-2' />
                                Location: Main Street
                            </span>
                            <span>
                                <ArrowRightLeft size={20} className='inline-flex me-2' />
                                Refund available
                            </span>
                        </div>
                        <p className='font-semibold me-8 hover:text-teal-600 text-teal-500 w-fit cursor-pointer'>
                            View shop details <MoveRight className='inline-flex ms-2 items-start' />
                        </p>
                    </div>
                </div>
                <div className=" mx-1 w-full xl:border-l xl:ps-2 xl:border-l-gray-600">
                    <div className='flex items-center space-x-2'>
                        <div className="flex items-center bg-gray-900 rounded-lg ps-2 pe-1 py-1 w-full xl:w-96">
                            <input
                                type="text"
                                className="flex-grow bg-transparent px-2  text-white outline-none placeholder-gray-500"
                                placeholder="Search"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        // Handle search when Enter is pressed
                                    }
                                }}
                            />
                            <button title="Search"
                                className="flex items-center justify-center h-10 w-10 bg-gray-800 rounded-full"
                                onClick={() => {
                                    // Handle search when the button is clicked
                                }}
                            >
                                <Search size={20} className="text-white" />
                            </button>
                        </div>
                        <select className="flex items-center text-md rounded-lg font-medium cursor-pointer bg-gray-800 text-white py-3 border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transform hover:scale-105 transition-transform">
                            <option value="near">All Categories</option>
                            <option value="fav">Favourites</option>
                            <option value="all">All Shops</option>
                        </select>
                    </div>
                    <div className='flex justify-center mt-2 -mb-2 text-teal-500 hover:text-teal-600 font-semibold cursor-pointer'>
                        <p>Place custom order without any products</p>
                    </div>
                </div>
            </div>
            <div className="pb-4 mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="flex flex-row bg-gray-800 shadow-md rounded-lg overflow-hidden border border-black/20 hover:border-white mx-2 p-4 "
                    >
                        <div className='me-2 pe-2'>
                            <img src={img} className='h-32 w-auto rounded-md' />
                        </div>

                        <div className='flex flex-col w-full'>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl max-w-[270px] font-bold line-clamp-2 text-white" title={product.name}>
                                        {product.name}
                                    </h4>
                                    <p className="text-sm text-gray-300">{product.category}</p>
                                </div>
                                <div className="relative">
                                    <Info
                                        size={20}
                                        className="text-teal-500 cursor-pointer"
                                        onMouseEnter={(e) => {
                                            const tooltip = e.currentTarget.nextSibling;
                                            tooltip.classList.remove('hidden');
                                        }}
                                        onMouseLeave={(e) => {
                                            const tooltip = e.currentTarget.nextSibling;
                                            tooltip.classList.add('hidden');
                                        }}
                                    />
                                    <div className="absolute hidden w-48 p-2 text-xs text-white bg-black rounded-lg shadow-lg -right-2 top-8 z-10">
                                        {product.description}
                                    </div>
                                </div>
                            </div>
                            <p className="text-lg text-teal-400 mt-2">{product.price}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <p className={`text-lg font-medium ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </p>
                                {product.inStock && (
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleDecrease(index)}
                                            className="bg-gray-700 text-white px-2 py-1 rounded-md"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="text-white">{quantities[index]}</span>
                                        <button
                                            onClick={() => handleIncrease(index)}
                                            className="bg-gray-700 text-white px-2 py-1 rounded-md"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

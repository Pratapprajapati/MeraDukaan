import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Tag, Clock } from 'lucide-react'; // Added Clock icon for timings
import axios from 'axios';

const ProductShops = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state;
    const [vendors, setVendors] = useState([]);

    // Fetch vendor data
    useEffect(() => {
        if (product && product.vendors) {
            axios
                .post(`/api/vendor/products`, { vendorsList: product.vendors })
                .then(res => {
                    const data = res.data.data;
                    setVendors(data);
                })
                .catch(e => console.error(e.response.data.message));
        }
    }, [product]);

    return (
        <div className="p-6">
            {/* Product Info Section */}
            <div className="flex flex-col items-center md:flex-row bg-gray-900 p-6 rounded-lg shadow-md">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-40 h-40 object-cover rounded-md mb-6 md:mb-0 md:mr-6"
                />
                <div className="flex flex-col justify-center text-white">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-lg mb-1">Category: {product.category}</p>
                    <p className="text-lg">Subcategory: {product.subCategory}</p>
                </div>
            </div>

            {/* Shop Cards Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Available Shops</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.map((shop) => (
                        <div
                            key={shop._id}
                            onClick={() => navigate(`/shops/vendor/${shop._id}`)}
                            className="bg-gray-800 text-white shadow-md rounded-lg overflow-hidden hover:ring-2 hover:ring-teal-500 transition-all duration-300 cursor-pointer"
                        >
                            <div className="">
                                <img src={shop.shopImage} alt={shop.shopName} className="w-full h-48 object-cover" />
                                <div className='p-3'>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-lg font-bold">{shop.shopName}</h4>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${shop.isOpen ? 'bg-green-500' : 'bg-red-500'
                                                }`}
                                        >
                                            {shop.isOpen ? 'Open' : 'Closed'}
                                        </span>
                                    </div>
                                    <div className="flex items-start text-gray-400 mb-1">
                                        <MapPin size={16} className="mr-2 mt-1" />
                                        <span>
                                            {shop.location.address}, {shop.location.area}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-400 mb-1">
                                        <Tag size={16} className="mr-2" />
                                        <span>{shop.location.city}, {shop.location.pincode}</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <Clock size={16} className="mr-2" />
                                        <span>Timings: {shop.shopTimings.start} - {shop.shopTimings.end}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductShops;

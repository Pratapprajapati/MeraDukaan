import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Truck, CreditCard, RefreshCw, Info, Edit, Save, Store, ShoppingCart, Package } from 'lucide-react';
import img from '../assets/Mcd.webp';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';

export default function ShopDetailsPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [vendorDetails, setVendorDetails] = useState({
        shopName: "McDonald's",
        shopImage: img,
        location: {
            address: "1234 Burger Street, Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            area: "BoboLand",
            city: "New York",
            pincode: "10001"
        },
        contact: {
            primary: "+1 555-555-1234",
            secondary: "+1 555-555-5678"
        },
        isOpen: false,
        shopOpen: "Open now",
        shopTimings: {
            start: "09:00 AM",
            end: "11:00 PM"
        },
        shopType: "Fast Food",
        delivery: true,
        refundExchange: false,
        onlinePayment: true,
        description: "Welcome to McDonald's, home of the world's best burgers, fries, and shakes."
    });

    const vendor = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        setVendorDetails(prevState => {
            const updatedVendorDetails = { ...prevState };
            let current = updatedVendorDetails;

            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    current[key] = value;
                } else {
                    current = current[key];
                }
            });

            return updatedVendorDetails;
        });
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const inputStyle = "bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded w-fit";

    if (loading) return <Loading />

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="max-w-5xl w-full bg-black/20 shadow-2xl shadow-black/60 rounded-lg border border-black/20 overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0 p-4">
                        <img
                            className="h-64 w-full rounded-md object-cover md:w-96"
                            src={vendorDetails.shopImage}
                            alt={vendorDetails.shopName}
                        />
                    </div>
                    <div className="p-8 pl-4">
                        <div className="uppercase tracking-wide text-sm text-white font-semibold flex justify-between">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="shopType"
                                    value={vendorDetails.shopType}
                                    onChange={handleInputChange}
                                    className={inputStyle}
                                />
                            ) : (
                                <span>{vendorDetails.shopType}</span>
                            )}
                            <button
                                onClick={() => vendor.userType === "vendor" && setVendorDetails({ ...vendorDetails, isOpen: !vendorDetails.isOpen })}
                                disabled={vendor.userType === "customer"}
                                className={`
                                        border rounded-md w-20 text-center p-1.5 m-1 -mt-2
                                        ${vendorDetails.isOpen ? 'bg-green-600 text-black' : 'bg-red-600 text-white'}
                                        ${vendor.userType === "customer" ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                            >
                                {vendorDetails.isOpen ? "OPEN" : "CLOSED"}
                            </button>
                        </div>
                        <h1 className="mt-1 text-3xl font-bold text-yellow-400 leading-tight">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="shopName"
                                    value={vendorDetails.shopName}
                                    onChange={handleInputChange}
                                    className={inputStyle}
                                />
                            ) : (
                                <span>{vendorDetails.shopName}</span>
                            )}
                        </h1>
                        <div className="mt-2 text-gray-300 flex flex-col">
                            <div className='flex'>
                                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                                <div className="flex flex-col space-y-2">
                                    {isEditing ? (
                                        <>
                                            <textarea
                                                name="location.address"
                                                value={vendorDetails.location.address}
                                                onChange={handleInputChange}
                                                className={`${inputStyle} w-full`}
                                                rows={2}
                                            />
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    name="location.area"
                                                    value={vendorDetails.location.area || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Area"
                                                    className={`${inputStyle}`}
                                                />
                                                <input
                                                    type="text"
                                                    name="location.city"
                                                    value={vendorDetails.location.city}
                                                    onChange={handleInputChange}
                                                    className={`${inputStyle} flex-grow`}
                                                />
                                                <input
                                                    type="text"
                                                    name="location.pincode"
                                                    value={vendorDetails.location.pincode}
                                                    onChange={handleInputChange}
                                                    className={`${inputStyle} w-24`}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p>{vendorDetails.location.address}</p>
                                            <p>{vendorDetails.location.area}, {vendorDetails.location.city} - {vendorDetails.location.pincode}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* New section for customer/vendor toggle */}
                            {vendor.userType === "customer" ? (
                                <div className="py-4 flex justify-between space-x-4 border-t border-t-gray-700 mt-3">
                                    <button
                                        onClick={() => navigate("/order/place")}
                                        className="flex items-center w- bg-yellow-500 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
                                    >
                                        <ShoppingCart className="mr-2" /> Cart/Order of this Vendor
                                    </button>
                                    <button
                                        onClick={() => navigate("/storefront")}
                                        className="flex items-center w- bg-teal-500 hover:bg-teal-600 text-black font-bold py-2 px-4 rounded"
                                    >
                                        <Package className="mr-2" /> View Products
                                    </button>
                                </div>
                            ) : (
                                <div className="py-4 flex max-sm:flex-col justify-between max-sm:space-y-3 border-t border-t-gray-700 mt-3 -mb-3 ">
                                    <button
                                        onClick={toggleEdit}
                                        className="flex items-center bg-teal-500 hover:bg-teal-600 text-black font-bold py-2 px-4 rounded"
                                    >
                                        {isEditing ? <><Save className="mr-2" /> Save</> : <><Edit className="mr-2" /> Edit</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 px-4 py-5">
                    <dl className="divide-y divide-gray-700">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-lg font-medium text-gray-200 flex items-center">
                                <Phone className="h-5 w-5 mr-2" />
                                Contact
                            </dt>
                            <dd className="mt-1 text-lg text-gray-300 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="contact.primary"
                                            value={vendorDetails.contact.primary}
                                            onChange={handleInputChange}
                                            className={inputStyle}
                                        />
                                        {vendorDetails.contact.secondary && (
                                            <>
                                                {' / '}
                                                <input
                                                    type="text"
                                                    name="contact.secondary"
                                                    value={vendorDetails.contact.secondary}
                                                    onChange={handleInputChange}
                                                    className={inputStyle}
                                                />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <span>{vendorDetails.contact.primary}{vendorDetails.contact.secondary && ` / ${vendorDetails.contact.secondary}`}</span>
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-lg font-medium text-gray-200 flex items-center">
                                <Clock className="h-5 w-5 mr-2" />
                                Hours
                            </dt>
                            <dd className="mt-1 text-lg text-gray-300 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="shopTimings.start"
                                            value={vendorDetails.shopTimings.start}
                                            onChange={handleInputChange}
                                            className={inputStyle}
                                        />
                                        {' - '}
                                        <input
                                            type="text"
                                            name="shopTimings.end"
                                            value={vendorDetails.shopTimings.end}
                                            onChange={handleInputChange}
                                            className={inputStyle}
                                        />
                                    </>
                                ) : (
                                    <span>{vendorDetails.shopTimings.start} - {vendorDetails.shopTimings.end}</span>
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-lg font-medium text-gray-200 flex items-center">
                                <Truck className="h-5 w-5 mr-2" />
                                Delivery
                            </dt>
                            <dd className="mt-1 text-lg text-gray-300 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <select
                                        name="delivery"
                                        value={vendorDetails.delivery ? 'Available' : 'Not available'}
                                        onChange={(e) => handleInputChange({
                                            target: {
                                                name: 'delivery',
                                                value: e.target.value === 'Available'
                                            }
                                        })}
                                        className="bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded"
                                    >
                                        <option>Available</option>
                                        <option>Not available</option>
                                    </select>
                                ) : (
                                    <span>{vendorDetails.delivery ? 'Available' : 'Not available'}</span>
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-lg font-medium text-gray-200 flex items-center">
                                <RefreshCw className="h-5 w-5 mr-2" />
                                Refund/Exchange
                            </dt>
                            <dd className="mt-1 text-lg text-gray-300 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <select
                                        name="refundExchange"
                                        value={vendorDetails.refundExchange ? 'Available' : 'Not available'}
                                        onChange={(e) => handleInputChange({
                                            target: {
                                                name: 'refundExchange',
                                                value: e.target.value === 'Available'
                                            }
                                        })}
                                        className="bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded"
                                    >
                                        <option>Available</option>
                                        <option>Not available</option>
                                    </select>
                                ) : (
                                    <span>{vendorDetails.refundExchange ? 'Available' : 'Not available'}</span>
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-lg font-medium text-gray-200 flex items-center">
                                <Info className="h-5 w-5 mr-2" />
                                Description
                            </dt>
                            <dd className="mt-1 text-lg text-gray-300 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <textarea
                                        name="description"
                                        value={vendorDetails.description}
                                        onChange={handleInputChange}
                                        className="bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded w-full"
                                        rows={3}
                                    />
                                ) : (
                                    <span>{vendorDetails.description}</span>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import img from "./Mcd.webp";
import { MapPin, Phone, CalendarClock, Store, Truck, ArrowRightLeft, CreditCard } from 'lucide-react';
import { categories } from '../Listings/Categories';

const products = [
    {
        id: 1,
        products: 49,
    },
    {
        id: 2,
        products: 44,
    },
    {
        id: 5,
        products: 64,
    },
    {
        id: 7,
        products: 64,
    },
    {
        id: 11,
        products: 86,
    },
    {
        id: 9,
        products: 4,
    },
    {
        id: 6,
        products: 6,
    },
];

const vendor = {
    username: 'localshop123',
    email: 'localshop123@example.com',
    shopName: 'Local Shop 1',
    registrationNumber: 'REG123456',
    location: {
        city: 'City Name',
        address: '123 Market St',
        pincode: 123456,
    },
    contact: {
        primary: 1234567890,
        secondary: 9876543210,
    },
    shopImage: img,  // Replace with actual image URL
    delivery: true,
    qrCodeImage: 'https://via.placeholder.com/150',  // Replace with actual QR image URL
    shopOpen: 'Everyday',
    shopTimings: {
        start: '09:00 AM',
        end: '09:00 PM',
    },
    shopType: 'General',
};

export default function VendorDisplayPage() {
    return (
        <div className="text-white min-h-screen py-8  ">
            <div className="md:mx-10 px-4 flex flex-col xl:flex-row gap-8">
                {/* Vendor Card */}
                <div className="flex-4 bg-black/30 rounded-lg shadow-lg shadow-black/50 xl:w-9/12">
                    <div className=''>
                        <img
                            src={vendor.shopImage}
                            alt={vendor.shopName}
                            className="h-80 w-full object-cover rounded-md"
                        />
                    </div>
                    <div className="p-6">
                        <h2 className="text-3xl font-bold text-yellow-500 mb-4">{vendor.shopName}</h2>
                        <div className='flex flex-col lg:flex-row max-lg:space-y-6'>
                            <div className="text-lg font-medium text-gray-300 space-y-6 w-full lg:w-1/2">
                                <p className='line-clamp-3'>
                                    <MapPin className='inline-flex me-2 w-7 h-7' />
                                    {vendor.location.address}, {vendor.location.city} - {vendor.location.pincode}
                                </p>
                                <p>
                                    <Phone className='inline-flex me-2 w-7 h-7' />
                                    {vendor.contact.primary} {vendor.contact.secondary && `/ ${vendor.contact.secondary}`}
                                </p>
                                <p>
                                    <CalendarClock className='inline-flex me-2 w-7 h-7' />
                                    {vendor.shopOpen} | {vendor.shopTimings.start} - {vendor.shopTimings.end}
                                </p>
                            </div>

                            <div className="text-lg lg:pl-6 font-medium space-y-6 w-full lg:w-1/2 lg:border-l text-gray-300 border-l-slate-300">
                                <p>
                                    <Store className='inline-flex me-2 w-7 h-7' />
                                    Store type: {vendor.shopType}
                                </p>
                                <p>
                                    <Truck className='inline-flex me-2 w-7 h-7' />
                                    Home Delivery: <span className='text-white'>{vendor.delivery ? 'Yes' : 'No'}</span>
                                </p>
                                <p>
                                    <ArrowRightLeft className='inline-flex me-2 w-7 h-7' />
                                    Refund / Exchange: <span className='text-white'>{vendor.delivery ? 'Yes' : 'No'}</span>
                                </p>
                                <p>
                                    <CreditCard className='inline-flex me-2 w-7 h-7' />
                                    Online Payment: <span className='text-white'>{vendor.delivery ? 'Yes' : 'No'}</span>
                                </p>
                            </div>
                        </div>
                        <div className='my-6 border-t border-t-gray-300 py-2'>
                            <h1 className="text-xl font-medium text-white my-2">Shop description: </h1>
                            <p className='text-gray-300'>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit excepturi rerum cum alias optio, autem asperiores eum minima numquam libero molestias quaerat sint! Inventore repudiandae itaque illo quo tempore recusandae.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Product Card */}
                <div className="flex-2 bg-black/30 rounded-lg p-4 shadow-lg shadow-black/50 xl:w-3/12">
                    <h1 className='font-semibold text-3xl text-yellow-500'>
                        Product categories:
                    </h1>
                    <div className="mt-6 space-y-6 shadow-inner flex flex-col justify-between">
                        <ul className="space-y-4 overflow-y-auto h-64 xl:h-[500px]">
                            {products.map((product) => (
                                <li key={product.id} className={`flex rounded-md p-3 items-center gap-4 bg-black/40 hover:bg-teal-600 cursor-pointer transform hover:scale-95 transition-transform`}>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{categories[product.id].name}</h3>
                                        <p className="text- font-medium text-white">Products: {product.products}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="xl:space-y-4 text-center mt-auto border-t border-t-gray-300 pt-3 flex flex-row xl:flex-col">
                            <button
                                type="button"
                                className="w-full max:xl:mx-2 rounded-md bg-teal-500 px-3 py-2 text-lg font-semibold text-black shadow-sm hover:bg-teal-600  transform hover:scale-95 transition-transform"
                            >
                                View Order (3) &rarr;
                            </button>
                            <button
                                type="button"
                                className="w-full max:xl:mx-2 rounded-md bg-yellow-500 px-2 py-2 text-lg font-semibold text-black shadow-sm hover:bg-yellow-600  transform hover:scale-95 transition-transform"
                            >
                                Continue shopping &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

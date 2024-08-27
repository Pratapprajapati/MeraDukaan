import React from 'react';
import img from "./Mcd.webp";
import { X, MapPin, Phone, CalendarClock, Store, Truck, ArrowRightLeft, CreditCard } from 'lucide-react';

const products = [
    {
        id: 1,
        name: 'Nike Air Force 1 07 LV8',
        href: '#',
        price: '₹47,199',
        originalPrice: '₹48,900',
        discount: '5% Off',
        color: 'Orange',
        size: '8 UK',
        imageSrc:
            'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/54a510de-a406-41b2-8d62-7f8c587c9a7e/air-force-1-07-lv8-shoes-9KwrSk.png',
    },
    {
        id: 2,
        name: 'Nike Blazer Low 77 SE',
        href: '#',
        price: '₹1,549',
        originalPrice: '₹2,499',
        discount: '38% off',
        color: 'White',
        leadTime: '3-4 weeks',
        size: '8 UK',
        imageSrc:
            'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e48d6035-bd8a-4747-9fa1-04ea596bb074/blazer-low-77-se-shoes-0w2HHV.png',
    },
    {
        id: 3,
        name: 'Nike Air Max 90',
        href: '#',
        price: '₹2219 ',
        originalPrice: '₹999',
        discount: '78% off',
        color: 'Black',
        imageSrc:
            'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/dunk-high-retro-shoe-DdRmMZ.png',
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
            <div className="md:mx-20 px-4 flex flex-col gap-8">
                {/* Vendor Card */}
                <div className="flex-4 bg-black/30 rounded-lg shadow-lg shadow-black/50">
                    <div className=''>
                        <img
                            src={vendor.shopImage}
                            alt={vendor.shopName}
                            className="h-80 w-full object-cover rounded-md"
                        />
                    </div>
                    <div className="p-6">
                        <h2 className="text-3xl font-bold text-teal-500 mb-4">{vendor.shopName}</h2>
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
                {/* <div className="flex-2 bg-gray-800 rounded-lg p-4 shadow-lg w-3/12">
                    <h1 className='font-semibold text-3xl'>
                        Product categories:
                    </h1>
                    <div className="mt-6 space-y-6 shadow-inner">
                        <ul className="space-y-4">
                            {products.map((product) => (
                                <li key={product.id} className="flex items-center gap-4">
                                    <img
                                        src={product.imageSrc}
                                        alt={product.name}
                                        className="h-16 w-16 rounded object-contain"
                                    />
                                    <div>
                                        <h3 className="text-sm text-gray-100">{product.name}</h3>
                                        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                                            <div>
                                                <dd className="inline font-bold">{product.price}</dd>
                                            </div>
                                            <div>
                                                <dt className="inline">Color:</dt>
                                                <dd className="inline">{product.color}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="space-y-4 text-center">
                            <button
                                type="button"
                                className="w-full rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                            >
                                View Cart (3)
                            </button>
                            <button
                                type="button"
                                className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                            >
                                Checkout
                            </button>
                            <a
                                href="#"
                                className="inline-block text-sm text-gray-600 transition hover:text-gray-700 hover:underline hover:underline-offset-4"
                            >
                                Continue shopping &rarr;
                            </a>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

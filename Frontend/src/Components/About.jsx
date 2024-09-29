import React from 'react';
import { ShoppingBag, Store, Truck } from 'lucide-react';
import Cookies from "js-cookie"
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
    const signedIn = Cookies.get("user") ? true : false
    const navigate = useNavigate()

    return (
        <div className="bg-[#0f1729] text-white rounded-lg">
            {/* Hero Section */}
            <section className="relative py-20">
                <div className="absolute inset-0 z-0">
                    <img
                        className="w-full h-full object-cover opacity-20"
                        src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Local market"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f1729] to-transparent"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <p className="text-blue-400 mb-3">Revolutionizing local commerce</p>
                    <h1 className="text-5xl font-bold mb-4">Empowering street-side shops in the digital age</h1>
                    <p className="text-xl text-gray-300 mb-8">
                        MeraDukaan bridges the gap between traditional local shops and the convenience of online shopping,
                        creating a vibrant digital marketplace for your neighborhood.
                    </p>
                    <div className="flex space-x-4">
                        {!signedIn && (
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300" onClick={() => navigate("/signin")}>
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Vendor Section */}
            <section className="py-20 bg-gray-900">
                <div className="container mx-auto px-4 flex items-center">
                    <div className="w-1/2 pr-8">
                        <h2 className="text-3xl font-bold mb-4">For Vendors: Expand Your Reach</h2>
                        <p className="text-gray-300 mb-6">
                            Join MeraDukaan to bring your local shop into the digital world. Reach more customers,
                            manage your inventory effortlessly, and grow your business with our easy-to-use platform.
                        </p>
                        <ul className="space-y-4">
                            <Feature icon={<Store />} text="Set up your digital storefront in minutes" />
                            <Feature icon={<ShoppingBag />} text="Manage orders and inventory all in one place" />
                            <Feature icon={<Truck />} text="Flexible delivery options for your customers" />
                        </ul>
                        {!signedIn && (
                            <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300" onClick={() => navigate("register/vendor")}>
                                Register as Vendor
                            </button>
                        )}
                    </div>
                    <div className="w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                            alt="Vendor using digital tools"
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </section>

            {/* Customer Section */}
            <section className="py-20 bg-gray-800">
                <div className="container mx-auto px-4 flex items-center">
                    <div className="w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                            alt="Customer shopping online"
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                    <div className="w-1/2 pl-8">
                        <h2 className="text-3xl font-bold mb-4">For Customers: Shop Local, Online</h2>
                        <p className="text-gray-300 mb-6">
                            Discover and support your local shops from the comfort of your home. Enjoy the convenience
                            of online shopping while keeping your money in your community.
                        </p>
                        <ul className="space-y-4">
                            <Feature icon={<Store />} text="Browse products from your favorite local shops" />
                            <Feature icon={<ShoppingBag />} text="Easy ordering and secure payment options" />
                            <Feature icon={<Truck />} text="Choose between delivery or in-store pickup" />
                        </ul>
                        {!signedIn && (
                            <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300" onClick={() => navigate("register/customer")}>
                                Register as Customer
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* MeraDukaan Overview */}
            <section className="py-16 bg-gray-900 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Why Choose MeraDukaan?</h2>
                    <div className="grid grid-cols-3 gap-8">
                        <OverviewCard
                            title="Support Local Economy"
                            description="Every purchase through MeraDukaan directly supports a local business in your community."
                        />
                        <OverviewCard
                            title="Convenience Meets Tradition"
                            description="Enjoy the ease of online shopping without losing the personal touch of local vendors."
                        />
                        <OverviewCard
                            title="Building Stronger Communities"
                            description="MeraDukaan helps preserve the charm of local markets in the digital age."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const Feature = ({ icon, text }) => (
    <li className="flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-full">
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <span>{text}</span>
    </li>
);

const OverviewCard = ({ title, description }) => (
    <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

export default AboutPage;
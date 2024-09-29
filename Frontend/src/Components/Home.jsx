import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, ShoppingCart } from 'lucide-react';

const Home = () => {
    return (
        <main className="bg-[#0f1729] min-h-full rounded-lg flex items-center justify-center p-8">
            <div className="max-w-7xl w-full mx-auto">

                {/* Header and description aligned to the left */}
                <div className="text-left mb-16 px-4 sm:px-8 lg:px-0">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
                        Your local shops are now online!!
                    </h1>
                    <p className="text-gray-400 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base lg:text-lg">
                        MeraDukaan connects you with your favorite local vendors, bringing the street-side shopping experience to your fingertips. 
                        Browse their products from the comfort of your home and place your order without having to go out and enquire.
                    </p>
                </div>

                {/* Feature Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-8 lg:px-0">
                    <FeatureCard
                        icon={<ShoppingBag />}
                        title="Nearby Shops"
                        description="Discover and shop from local vendors in your area. Support your community while enjoying the convenience of online ordering."
                        navlink="/shops"
                    />
                    <FeatureCard
                        icon={<Package />}
                        title="Products"
                        description="Browse a wide range of products and choose your preferred local shop. Get quality items from trusted neighborhood vendors."
                        navlink="/products"
                    />
                    <FeatureCard
                        icon={<ShoppingCart />}
                        title="Cart and Orders"
                        description="Easily manage your cart, place orders from multiple shops, and track your deliveries. Enjoy a seamless local shopping experience."
                        navlink="/cart"
                    />
                </div>
            </div>
        </main>
    );
};

const FeatureCard = ({ icon, title, description, navlink }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#1e293b] rounded-lg p-6 lg:p-8 text-left shadow-md hover:shadow-black/70 shadow-black/30 transition-shadow duration-200 cursor-pointer hover:bg-slate-700" onClick={() => navigate(navlink)}>
            <div className="bg-gray-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {React.cloneElement(icon, { className: "w-6 h-6 text-yellow-500" })}
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">{title}</h2>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">{description}</p>
        </div>
    );
};

export default Home;

import React, { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ShoppingBag, Package, ShoppingCart } from 'lucide-react';

const Home = () => {
    const customer = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (customer.userType !== "customer") {
            navigate(-1);
            return;
        }
    }, [customer.userType, navigate])

    return (
        <div className="min-h-full flex flex-col bg-cover bg-center relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"}}>
            <div className="absolute inset-0 bg-black opacity-80"></div>
            <div className="relative z-10 p-8 flex-grow">
                {/* Header and description aligned to the left */}
                <div className="max-w-2xl text-white mb-12">
                    <h1 className="text-4xl font-bold mb-4">Your local shops are now online!!</h1>
                    <p className="text-xl mb-6">
                        MeraDukaan connects you with your favorite local vendors, bringing the street-side shopping experience to your fingertips.
                        Browse their products from the comfort of your home and place your order without having to go out and enquire.
                    </p>
                </div>

                {/* Feature Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

            {/* New line for About page at the bottom */}
            <div className="relative z-10 p-8 text-center">
                <p className="text-white text-xl font-bold">
                    Curious about our mission? 
                    <span 
                        className="text-yellow-400 hover:text-yellow-300 cursor-pointer ml-2 underline"
                        onClick={() => navigate("/")}
                    >
                        Discover the story behind MeraDukaan
                    </span>
                </p>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, navlink }) => {
    const navigate = useNavigate();

    return (
        <div 
            className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate(navlink)}
        >
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-full mb-4">
                {React.cloneElement(icon, { className: "w-6 h-6 text-black" })}
            </div>
            <h2 className="text-xl font-semibold mb-2 text-white">{title}</h2>
            <p className="text-gray-200">{description}</p>
        </div>
    );
};

export default Home;
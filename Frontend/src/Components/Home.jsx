import React from "react";
// import { categories } from "./Listings/Categories";
import { MoveRight, MapPin, Tag, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

// Updated sample shop data array
const shops = [
    { id: 1, name: "Fresh Groceries", image: "/api/placeholder/400/320", isOpen: true, area: "Downtown", pincode: "110001", shopType: "Grocery" },
    { id: 2, name: "Tech Haven", image: "/api/placeholder/400/320", isOpen: false, area: "Cyber City", pincode: "110002", shopType: "Electronics" },
    { id: 3, name: "Fashion Flair", image: "/api/placeholder/400/320", isOpen: true, area: "Mall Road", pincode: "110003", shopType: "Clothing" },
    { id: 4, name: "Book Nook", image: "/api/placeholder/400/320", isOpen: true, area: "Academic Block", pincode: "110004", shopType: "Bookstore" },
    { id: 5, name: "Fitness First", image: "/api/placeholder/400/320", isOpen: false, area: "Sports Complex", pincode: "110005", shopType: "Fitness Equipment" },
    { id: 6, name: "Home Decor Hub", image: "/api/placeholder/400/320", isOpen: true, area: "Residence Park", pincode: "110006", shopType: "Home Goods" },
];

// const categoryList = categories.slice(0, 5);

const Home = () => {
    const navigate = useNavigate();

    return (
        <main className="container mx-auto mt-8 px-4">
            <section className="text-center mb-12">
                <h2 className="text-5xl font-bold text-yellow-500 mb-4">Welcome to MeraDukaan!</h2>
                <p className="mt-4 text-xl text-gray-300">
                    Your local shops at your fingertips.
                </p>
                <div className="mt-8 flex justify-center">
                    <div className="relative w-full max-w-xl">
                        <input
                            type="text"
                            placeholder="Search for shops or products..."
                            className="w-full py-3 px-4 pr-12 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </section>

            {/* SHOP LISTING */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-100">
                        Shops near you
                    </h3>
                    <NavLink to={"/shops"}
                        className="flex items-center text-lg font-medium text-yellow-500 hover:text-yellow-400 transform hover:scale-105 transition-transform"
                    >
                        More shops <MoveRight className="ml-2" />
                    </NavLink>
                </div>
                <p className="text-gray-400 mb-4">(Shops registered with MeraDukaan are only displayed here)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shops.map((shop) => (
                        <div
                            key={shop.id}
                            onClick={() => navigate(`vendor/${shop.id}`)}
                            className="bg-gray-800 text-white shadow-md rounded-lg overflow-hidden hover:ring-2 hover:ring-yellow-500 transition-all duration-300 cursor-pointer"
                        >
                            <img src={shop.image} alt={shop.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-lg font-bold">{shop.name}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${shop.isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {shop.isOpen ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-400 mb-1">
                                    <MapPin size={16} className="mr-2" />
                                    <span>{shop.area}, {shop.pincode}</span>
                                </div>
                                <div className="flex items-center text-gray-400">
                                    <Tag size={16} className="mr-2" />
                                    <span>{shop.shopType}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CATEGORY LISTING */}
            <section className="mb-16">
                <h3 className="text-3xl font-bold text-gray-100 mb-6">
                    Product Categories
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryList.map((cat) => (
                        <div
                            key={cat.id}
                            className={`${cat.color} shadow-md rounded-lg overflow-hidden border cursor-pointer border-black/20 hover:border-white hover:scale-105 transition-all duration-300`}
                        >
                            <div className="p-6 flex flex-col items-center text-center">
                                <span className="text-4xl mb-3">{cat.icon}</span>
                                <h4 className="text-xl font-bold mb-1">{cat.name}</h4>
                                <p className="text-sm opacity-75">Shops: 4</p>
                            </div>
                        </div>
                    ))}
                    <div
                        onClick={() => navigate("/categories")}
                        className="bg-gray-700 shadow-md rounded-lg overflow-hidden border cursor-pointer border-black/20 hover:border-white hover:scale-105 transition-all duration-300"
                    >
                        <div className="p-6 flex flex-col items-center text-center">
                            <MoveRight className="text-4xl mb-3" />
                            <h4 className="text-xl font-bold">View More</h4>
                            <p className="text-sm opacity-75">Categories</p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Home;
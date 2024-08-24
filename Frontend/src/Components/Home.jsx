import React from "react";
import { categories } from "./Listings/Categories";
import {MoveRight} from "lucide-react"
import { useNavigate } from "react-router-dom";

// Sample shop data array
const shops = [
    { id: 1, name: "Shop 1", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Shop 2", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Shop 3", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Shop 4", image: "https://via.placeholder.com/150" },
    { id: 5, name: "Shop 5", image: "https://via.placeholder.com/150" },
    { id: 6, name: "Shop 6", image: "https://via.placeholder.com/150" },
];

const categoryList = categories.slice(0, 5)


const Home = () => {
    
    const navigate = useNavigate()


    return (
        <main className="container mx-auto mt-8">
            <section className="text-center">
                <h2 className="text-4xl font-bold text-yellow-500">Welcome to MeraDukaan!</h2>
                <p className="mt-4 text-lg text-gray-300">
                    Your local shops at your fingertips.
                </p>
            </section>

            {/* SHOP LISTING */}
            <section className="mt-12">
                <div className="flex justify-between">
                    <h3 className="text-3xl font-bold text-gray-100 mb-4">
                        Shops near you
                        <span className="text-gray-400 text-base ms-2">(Shops registered with MeraDukaan are only displayed here)</span>
                    </h3>
                    <h3 className="flex items-center text-lg font-medium cursor-pointer hover:text-yellow-500 transform hover:scale-105 transition-transform">
                        More shops
                    </h3>
                </div>
                <div className="flex overflow-x-scroll space-x-4 pb-4 custom-scrollbar">
                    {shops.map((shop) => (
                        <div
                            key={shop.id}
                            className="min-w-[400px] h-[320px] bg-black/20 text-gray-900 shadow-md rounded-lg overflow-hidden hover:border hover:border-gray-400"
                        >
                            <img src={shop.image} alt={shop.name} className="w-full h-60 object-cover hover:border-gray-900 hover:border hover:rounded-lg" />
                            <div className="p-4">
                                <div className="flex justify-between">
                                    <h4 className="text-lg font-bold text-white">{shop.name}</h4>
                                    <h4 className="text-white">4.5⭐</h4>
                                </div>
                                <h4 className="text-gray-400">Shop Address</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CATEGORY LISTING */}
            <section className="mt-12">
                <div className="flex justify-between">
                    <h3 className="text-3xl font-bold text-gray-100 mb-4">
                        Product Categories
                    </h3>
                </div>
                <div className="pb-4 grid sm:grid-cols-2 lg:grid-cols-3">
                    {categoryList.map((cat) => (
                        <div
                            key={cat.id}
                            className={`flex flex-row ${cat.color} shadow-md rounded-lg overflow-hidden border cursor-pointer border-black/20 hover:border-white m-3 items-center transform hover:scale-95 transition-transform`}
                        >
                            <h1 className="p-4 pe-2 text-3xl">{cat.icon}</h1>
                            <div className="p-4">
                                <h4 className="text-xl font-bold">{cat.name}</h4>
                                <h4 className="font-medium">Shops: 4</h4>
                            </div>
                        </div>
                    ))}
                    <div
                        onClick={() => navigate("/categories")}
                        className={`flex flex-row bg-gray-600 shadow-md rounded-lg overflow-hidden border cursor-pointer border-black/20 hover:border-white m-3 items-center transform hover:scale-95 transition-transform`}
                    >
                        <h1 className="p-4 pe-2 text-3xl"></h1>
                        <div className="p-4">
                            <h4 className="text-xl font-bold">View More Categories <MoveRight/></h4>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;

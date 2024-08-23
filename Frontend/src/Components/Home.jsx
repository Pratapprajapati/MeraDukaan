import React from "react";
import {
    Carrot
} from "lucide-react"

// Sample shop data array
const shops = [
    { id: 1, name: "Shop 1", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Shop 2", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Shop 3", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Shop 4", image: "https://via.placeholder.com/150" },
    { id: 5, name: "Shop 5", image: "https://via.placeholder.com/150" },
    { id: 6, name: "Shop 6", image: "https://via.placeholder.com/150" },
];

const categories = [
    { id: 1, name: "Food and groceries" },
    { id: 2, name: "Stationary" },
    { id: 3, name: "Dairy" },
    { id: 4, name: "Electronics and hardware" },
    { id: 5, name: "General" },
    { id: 6, name: "Shop 6" },
];

// Reusable ShopCard component
const ShopCard = ({ name, image }) => (
    <div className="min-w-[400px] h-[300px] bg-black/20 text-gray-900 shadow-md rounded-lg overflow-hidden">
        <img src={image} alt={name} className="w-full h-60 object-cover" />
        <div className="p-4 text-center">
            <h4 className="text-lg font-bold text-white">{name}</h4>
        </div>
    </div>
);

const Home = () => {
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
            {/* SHOP LISTING */}
            <section className="mt-12">
                <div className="flex justify-between">
                    <h3 className="text-3xl font-bold text-gray-100 mb-4">
                        Product Categories
                    </h3>
                    {/* <h3 className="flex items-center text-lg font-medium cursor-pointer hover:text-yellow-500 transform hover:scale-105 transition-transform">
                        More shops
                    </h3> */}
                </div>
                <div className="pb-4 grid sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex flex-row bg-gray-700 text-gray-900 shadow-md rounded-lg overflow-hidden border border-black/20 hover:border-gray-400 m-3 items-center"
                        >
                            <Carrot className="text-white h-10 w-10 ms-4"/>
                            <div className="p-4">
                                <h4 className="text-lg font-bold text-white">{cat.name}</h4>
                                <h4 className="text-gray-400">Shops: 4</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Home;

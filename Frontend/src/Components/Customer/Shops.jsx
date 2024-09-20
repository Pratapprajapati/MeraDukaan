import React, { useState, useEffect } from 'react';
import { Search, MapPin, Tag } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const shops = [
    { id: 1, name: "Shop 1", image: "https://via.placeholder.com/150", area: "Downtown", pincode: "123456", isOpen: true, category: "Grocery" },
    { id: 2, name: "Shop 2", image: "https://via.placeholder.com/150", area: "Uptown", pincode: "234567", isOpen: false, category: "Electronics" },
    { id: 3, name: "Shop 3", image: "https://via.placeholder.com/150", area: "Midtown", pincode: "345678", isOpen: true, category: "Clothing" },
    { id: 4, name: "Shop 4", image: "https://via.placeholder.com/150", area: "Suburb", pincode: "456789", isOpen: true, category: "Grocery" },
    { id: 5, name: "Shop 5", image: "https://via.placeholder.com/150", area: "Downtown", pincode: "567890", isOpen: false, category: "Electronics" },
    { id: 6, name: "Shop 6", image: "https://via.placeholder.com/150", area: "Uptown", pincode: "678901", isOpen: true, category: "Clothing" },
];

const categories = ["All", "Grocery", "Electronics", "Clothing"];
const locations = ["My Area", "My City"];

export default function Shops() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedLocation, setSelectedLocation] = useState("All");


    const customer = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        customer.userType != "customer" ? navigate(-1) : null
        setLoading(false)
    })


    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || shop.category === selectedCategory) &&
        (selectedLocation === "All" || (selectedLocation === "My Area" ? shop.area === "Downtown" : true))
    );

    return (
        <section className="container mx-auto mt-8 px-4">
            <h3 className="text-3xl font-bold text-gray-100 mb-4">
                Shops near you
                <span className="text-gray-400 text-base ms-2">(Shops registered with MeraDukaan are only displayed here)</span>
            </h3>

            <div className="flex flex-wrap gap-4 mb-6 w-full">
                <div className="flex-grow relative w-3/6">
                    <input
                        type="text"
                        placeholder="Search shops..."
                        className="w-full py-2 px-4 pl-10 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <select
                    className="bg-gray-800 w-1/6 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select
                    className="bg-gray-800 w-1/6 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                >
                    {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                {filteredShops.map((shop) => (
                    <div
                        key={shop.id} onClick={() => navigate("shop")}
                        className="bg-gray-800 text-white shadow-md rounded-lg overflow-hidden hover:ring-2 hover:ring-teal-500 transition-all duration-300"
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
                                <span>{shop.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
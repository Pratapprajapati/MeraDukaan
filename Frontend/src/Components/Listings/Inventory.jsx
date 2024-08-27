import React, { useState } from 'react';
import { Search, Info, Plus, Minus } from 'lucide-react';

export const products = [
    { id: 1, name: "Nike Air Max 90", price: "₹8,999", category: "Footwear", inStock: true, description: "The Nike Air Max 90 stays true to its OG roots with an iconic Waffle outsole." },
    { id: 2, name: "Sony WH-1000XM4", price: "₹24,990", category: "Electronics", inStock: true, description: "Industry-leading noise canceling with Dual Noise Sensor technology." },
    { id: 3, name: "Adidas Ultraboost", price: "₹14,999", category: "Footwear", inStock: false, description: "Responsive running shoes with a snug, sock-like fit." },
    { id: 4, name: "Samsung Galaxy S21", price: "₹69,999", category: "Electronics", inStock: true, description: "Pro-grade camera and 8K video for the creators." },
    { id: 5, name: "Wooden Coffee Table", price: "₹5,499", category: "Furniture", inStock: true, description: "Crafted with durable wood, perfect for your living room." },
    { id: 6, name: "Apple MacBook Air M2", price: "₹1,14,990", category: "Electronics", inStock: false, description: "Apple's thinnest and lightest notebook, completely transformed by the M2 chip." },
    { id: 7, name: "Fitbit Charge 4", price: "₹9,999", category: "Health & Wellness", inStock: true, description: "Fitbit's most advanced fitness & health tracker." },
    { id: 8, name: "IKEA Dining Set", price: "₹19,999", category: "Furniture", inStock: true, description: "Modern and minimalistic dining set perfect for family dinners." },
    { id: 9, name: "Canon EOS 1500D", price: "₹31,999", category: "Electronics", inStock: false, description: "Capture stunning images with this easy-to-use DSLR camera." },
    { id: 10, name: "Nike Dri-FIT T-Shirt", price: "₹1,199", category: "Clothing", inStock: true, description: "Lightweight and breathable T-shirt ideal for your workouts." },
    { id: 11, name: "Samsung QLED 4K TV", price: "₹89,999", category: "Electronics", inStock: true, description: "Unveil hidden details with vibrant colors in 4K resolution." },
    { id: 12, name: "Puma Running Shoes", price: "₹3,999", category: "Footwear", inStock: false, description: "Engineered for superior cushioning and grip." },
    { id: 13, name: "Reebok Yoga Mat", price: "₹1,499", category: "Sports & Fitness", inStock: true, description: "High-density mat with superior grip and comfort." },
    { id: 14, name: "Sony PlayStation 5", price: "₹49,999", category: "Electronics", inStock: false, description: "Next-gen gaming console with ultra-high-speed SSD." },
    { id: 15, name: "H&M Cotton Hoodie", price: "₹1,799", category: "Clothing", inStock: true, description: "Soft and warm hoodie made with organic cotton." },
];

export default function Inventory() {
    const [quantities, setQuantities] = useState(Array(products.length).fill(0));

    const handleIncrease = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;
        setQuantities(newQuantities);
    };

    const handleDecrease = (index) => {
        if (quantities[index] > 1) {
            const newQuantities = [...quantities];
            newQuantities[index] -= 1;
            setQuantities(newQuantities);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <div className="flex justify-between mb-4">
                <h3 className="text-3xl font-bold text-gray-100">
                    Products
                </h3>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="p-2 rounded-md bg-gray-200 text-gray-800"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                // Handle search
                            }
                        }}
                    />
                    <button className="p-2 bg-teal-500 rounded-md text-white">
                        <Search size={20} />
                    </button>
                </div>
            </div>
            <div className="pb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="flex flex-col bg-gray-800 shadow-md rounded-lg overflow-hidden border border-black/20 hover:border-white p-4 "
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-xl font-bold text-white">{product.name}</h4>
                                <p className="text-sm text-gray-300">{product.category}</p>
                            </div>
                            <div className="relative">
                                <Info
                                    size={20}
                                    className="text-teal-500 cursor-pointer"
                                    onMouseEnter={(e) => {
                                        const tooltip = e.currentTarget.nextSibling;
                                        tooltip.classList.remove('hidden');
                                    }}
                                    onMouseLeave={(e) => {
                                        const tooltip = e.currentTarget.nextSibling;
                                        tooltip.classList.add('hidden');
                                    }}
                                />
                                <div className="absolute hidden w-48 p-2 text-xs text-white bg-black rounded-lg shadow-lg -right-2 top-8 z-10">
                                    {product.description}
                                </div>
                            </div>
                        </div>
                        <p className="text-lg text-teal-400 mt-2">{product.price}</p>
                        <div className="flex justify-between items-center mt-4">
                            <p className={`text-lg font-medium ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </p>
                            {product.inStock && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleDecrease(index)}
                                        className="bg-gray-700 text-white px-2 py-1 rounded-md"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="text-white">{quantities[index]}</span>
                                    <button
                                        onClick={() => handleIncrease(index)}
                                        className="bg-gray-700 text-white px-2 py-1 rounded-md"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

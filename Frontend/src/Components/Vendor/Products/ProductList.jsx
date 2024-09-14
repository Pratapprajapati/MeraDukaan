import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowRight } from 'lucide-react';
import img from "../../Profiles/img1.webp"

// Custom Card component
const Card = ({ children, className }) => (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
        {children}
    </div>
);

// Custom Button component
const Button = ({ children, className, onClick, variant = 'default' }) => {
    const baseClasses = "px-3 py-1 rounded-md font-medium transition-colors duration-200 text-sm";
    const variantClasses = {
        default: "bg-teal-500 text-black hover:bg-teal-600",
        outline: "bg-transparent text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white"
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

const dailyNeeds = ["Packaged Food", "Dairy Products", "Beverages", "Personal Care", "Home Essentials", "Household Items"];


export default function ProductList() {
    const [selectedSubCategory, setSelectedSubCategory] = useState('All Categories');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Simulated product data - replace with actual API call
        const dummyProducts = dailyNeeds.flatMap(subCategory =>
            Array(6).fill().map((_, index) => ({
                id: `${subCategory}-${index}`,
                name: `${subCategory} Item ${index + 1}`,
                price: Math.floor(Math.random() * 100) + 1,
                category: 'Daily Needs',
                subCategory,
                image: `/api/placeholder/80/80`,
                quantity: ['count', 'weight', 'volume'][Math.floor(Math.random() * 3)]
            }))
        );
        setProducts(dummyProducts);
    }, []);

    const filteredProducts = products.filter(product =>
        (selectedSubCategory === 'All Categories' || product.subCategory === selectedSubCategory) &&
        (searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    );

    const handleSearch = () => {
        console.log('Searching for:', searchTerm);
    };

    const handleAddToInventory = (product) => {
        console.log('Adding to inventory:', product);
        // Implement your add to inventory logic here
    };

    const ProductCard = ({ product }) => (
        <Card className="flex items-center p-2 border bg-slate-700 border-slate-900/35 shadow-lg shadow-black/20">
            <div className='w-24 h-24 mr-3'>
                <img src={img} alt={product.name} className='h-full w-full object-cover rounded' />
            </div>
            <div className='flex-grow'>
                <h4 className="text-sm font-bold text-white line-clamp-1" title={product.name}>
                    {product.name}
                </h4>
                <p className="text-xs text-gray-300">{product.subCategory}</p>
                <p className="text-xs text-gray-300">{product.quantity}</p>
                <p className="text-sm font-semibold text-teal-500 mt-1">${product.price.toFixed(2)}</p>
            </div>
            <Button
                className="ml-2"
                onClick={() => handleAddToInventory(product)}
            >
                <Plus size={14} className="mr-1 inline" /> Add
            </Button>
        </Card>
    );

    return (
        <div className="p-4 bg-black/20 shadow-2xl shadow-black min-h-screen text-white rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Add Product</h1>

            <div className='flex max-sm:flex-col max-sm:space-y-2 items-center md:space-x-2 mb-6'>
                <div className="flex items-center bg-gray-900 rounded-lg ps-2 pe-1 py-1 w-full border border-gray-800">
                    <input
                        type="text"
                        className="flex-grow bg-transparent px-2 text-white outline-none placeholder-gray-500"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <button
                        title="Search"
                        className="flex items-center justify-center h-10 w-10 bg-gray-700 rounded-full"
                        onClick={handleSearch}
                    >
                        <Search size={16} className="text-white" />
                    </button>
                </div>
                <select
                    className="flex max-sm:w-full items-center text-md rounded-lg font-medium cursor-pointer bg-gray-800 text-white py-3 border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transform hover:scale-105 transition-transform"
                    value={selectedSubCategory}
                    onChange={e => setSelectedSubCategory(e.target.value)}
                >
                    <option value="All Categories">All Categories</option>
                    {dailyNeeds.map(subCategory => (
                        <option key={subCategory} value={subCategory}>{subCategory}</option>
                    ))}
                </select>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Daily Needs</h2>

            <div className="space-y-6">
                {dailyNeeds.map(subCategory => {
                    const subCategoryProducts = filteredProducts.filter(product => product.subCategory === subCategory);
                    if (subCategoryProducts.length === 0) return null;
                    return (
                        <div key={subCategory} className="bg-gray-800 rounded-lg p-4">
                            <div className='flex justify-between items-center'>
                                <h3 className="text-xl font-semibold mb-3">{subCategory}</h3>
                                <button className={`mb-3 text-teal-500 hover:text-teal-600 font-semibold ${selectedSubCategory === subCategory ? "hidden" : null}`} onClick={() => setSelectedSubCategory(subCategory)}>
                                    View more <ArrowRight className='inline-flex' />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                {subCategoryProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { sampleProducts } from '../Listings/sampleData';

// Custom Button component
const Button = ({ children, className, onClick }) => {
    return (
        <button
            className={`w-full px-3 py-2 rounded-md font-semibold text-sm bg-teal-500 text-black hover:bg-teal-600 transition-colors duration-200 ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

const dailyNeeds = ["Packaged Food", "Dairy Products", "Beverages", "Personal Care", "Home Essentials"];

export default function ProductList() {
    const [selectedSubCategory, setSelectedSubCategory] = useState('All Categories');
    const [searchTerm, setSearchTerm] = useState('');
    const [products] = useState(sampleProducts);

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
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h4 className="text-lg font-semibold text-white mb-1">{product.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{product.subCategory}</p>
                <Button onClick={() => handleAddToInventory(product)}>
                    Sold by {product.shops} shops
                </Button>
            </div>
        </div>
    );

    return (
        <div className="p-4 bg-black/30 shadow-2xl shadow-black min-h-screen text-white rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Product</h1>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
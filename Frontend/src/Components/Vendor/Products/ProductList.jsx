import { useState, useEffect } from 'react';
import { Search, Plus, ArrowRight, Edit, Info } from 'lucide-react';
import img from "../../assets/img1.webp"
import { useOutletContext, useNavigate } from 'react-router-dom';
import Loading from "../../AppPages/Loading"
const dailyNeeds = ["Packaged Food", "Dairy Products", "Beverages", "Personal Care", "Home Essentials"];

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

const ProductCard = ({ product, handleAddToInventory }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-800 w-72 rounded-lg overflow-hidden shadow-lg shadow-black/30 flex-shrink-0 border border-black/40 hover:border-gray-400">
            <img src={img} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-4 bg-gray-950">
                <h4 className="text-lg font-semibold text-white mb-1">{product.name}</h4>
                <p className="text-sm text-gray-400 mb-1">{product.subCategory}</p>
                <div className='flex justify-between items-center mb-4 relative group'>
                    <p className="text-sm font-semibold text-teal-500">${product.price.toFixed(2)}</p>
                    <div className="relative">
                        <Info
                            size={20}
                            className="text-teal-500 cursor-pointer"
                        />
                        <div className="absolute hidden group-hover:block w-48 p-2 text-xs text-white bg-black rounded-lg shadow-lg right-0 bottom-full z-10">
                           You can change the price for this product for yourself
                        </div>
                    </div>
                </div>
                <div className="flex justify-between space-x-2">
                    <Button
                        className="flex-1 relative group"
                        onClick={() => handleAddToInventory(product)}
                    >
                        <Plus size={14} className="mr-1 inline" /> Quick Add
                        <div className="absolute hidden group-hover:block w-48 p-2 text-xs text-white bg-black rounded-lg shadow-lg left-24 -translate-x-1/2 bottom-full mb-2 z-10">
                            Quickly add this item to your inventory
                        </div>
                    </Button>
                    <Button
                        className="flex-1 relative group"
                        onClick={() => navigate("add")}
                        variant="outline"
                    >
                        <Edit size={14} className="mr-1 inline" /> Edit Info
                        <div className="absolute hidden group-hover:block w-48 p-2 text-xs text-white bg-black rounded-lg shadow-lg left-8 -translate-x-1/2 bottom-full mb-2 z-10">
                            Edit this item's information before adding to inventory
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
};

const AllCategories = ({ filteredProducts, handleAddToInventory, setSelectedSubCategory }) => (
    <div className="space-y-8">
        {dailyNeeds.map(subCategory => {
            const subCategoryProducts = filteredProducts.filter(product => product.subCategory === subCategory);
            if (subCategoryProducts.length === 0) return null;
            return (
                <div key={subCategory} className="bg-gray-800 rounded-lg p-4">
                    <div className='flex justify-between items-center mb-4'>
                        <h3 className="text-xl font-semibold">{subCategory}</h3>
                        <button
                            className="text-teal-500 hover:text-teal-600 font-semibold flex items-center"
                            onClick={() => setSelectedSubCategory(subCategory)}
                        >
                            View more <ArrowRight className='ml-1' />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex space-x-4 pb-4">
                            {subCategoryProducts.map(product => (
                                <ProductCard key={product.id} product={product} handleAddToInventory={handleAddToInventory} />
                            ))}
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
);

const SpecificCategory = ({ filteredProducts, handleAddToInventory, selectedSubCategory }) => (
    <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">{selectedSubCategory}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} handleAddToInventory={handleAddToInventory} />
            ))}
        </div>
    </div>
);

export default function ProductList() {
    const [selectedSubCategory, setSelectedSubCategory] = useState('All Categories');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);

    const vendor = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        vendor.userType != "vendor" ? navigate(-1) : null
        setLoading(false)
    }, [])

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
        navigate("add")
        // Implement your add to inventory logic here
    };

    if (loading) return <Loading />

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

            {selectedSubCategory === 'All Categories' ? (
                <AllCategories
                    filteredProducts={filteredProducts}
                    handleAddToInventory={handleAddToInventory}
                    setSelectedSubCategory={setSelectedSubCategory}
                />
            ) : (
                <SpecificCategory
                    filteredProducts={filteredProducts}
                    handleAddToInventory={handleAddToInventory}
                    selectedSubCategory={selectedSubCategory}
                />
            )}
        </div>
    );
}
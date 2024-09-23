import { useState, useEffect } from 'react';
import { Search, Plus, ArrowRight, Edit, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Loading from "../../AppPages/Loading";
import Swal from 'sweetalert2';
import axios from 'axios';

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

const ProductCard = ({ product, handleAddToInventory, inventory }) => {
    const navigate = useNavigate();
    const exists = inventory.includes(product._id)

    return (
        <div className="bg-gray-800 w-72 rounded-lg overflow-hidden shadow-lg shadow-black/30 flex-shrink-0 border border-black/40 hover:border-gray-400">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-4 bg-gray-950">
                <h4 className="text-lg font-semibold text-white mb-1">{product.name}</h4>
                <p className="text-sm text-gray-400 mb-1">{product.subCategory}</p>
                <div className='flex justify-between items-center mb-4 relative group'>
                    <p className="tracking-widest font-semibold text-gray-400">₹<span className='text-yellow-500'>{product.price}</span></p>
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
                {
                    exists ? (
                        <div className="flex justify-between space-x-2">
                            <p className='w-full bg-green-600 text-black font-semibold rounded-lg text-center p-1'>Already in inventory</p>
                        </div>

                    ) : (
                        <div className="flex justify-between space-x-2">
                            <Button
                                className="flex-1 relative group"
                                onClick={() => handleAddToInventory(product._id)}
                            >
                                <Plus size={14} className="mr-1 inline" /> Quick Add
                                <div className="absolute hidden group-hover:block w-48 p-2 text-xs text-white bg-black rounded-lg shadow-lg left-24 -translate-x-1/2 bottom-full mb-2 z-10">
                                    Quickly add this item to your inventory
                                </div>
                            </Button>
                            <Button
                                className="flex-1 relative group"
                                onClick={() => navigate("add", {state: product})}
                                variant="outline"
                            >
                                <Edit size={14} className="mr-1 inline" /> Edit & Add
                                <div className="absolute hidden group-hover:block w-48 p-2 text-xs text-white bg-black rounded-lg shadow-lg left-8 -translate-x-1/2 bottom-full mb-2 z-10">
                                    Edit this item's information before adding to inventory
                                </div>
                            </Button>
                        </div>
                    )
                }

            </div>
        </div>
    );
};


const AllCategories = ({ products, handleAddToInventory, inventory, setSelectedSubCategory }) => (
    <div className="space-y-8">
        {dailyNeeds.map(subCategory => {
            const subCategoryProducts = products.filter(product => product.products.subCategory === subCategory);
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
                            {subCategoryProducts.map(({ products }, index) => (
                                <ProductCard key={index} product={products} handleAddToInventory={handleAddToInventory} inventory={inventory} />
                            ))}
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
);

const SpecificCategory = ({ specificProducts, handleAddToInventory, inventory, navigate, selectedSubCategory, currentPage, totalProducts, onPageChange }) => {
    const itemsPerPage = 32;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalProducts);

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4 text-white">{selectedSubCategory}</h3>

            {specificProducts.length === 0 ? (
                <div className="text-center">
                    <p className="text-white text-2xl mb-4">No products available in this category.</p>
                    <p className="text-gray-400">
                        Could not find item you're looking for? {' '}
                        <span className="text-teal-500 cursor-pointer" onClick={() => navigate("new")}>add it to general products list</span>
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-5 place-items-center">
                        {specificProducts.map((product, index) => (
                            <ProductCard key={index} product={product} handleAddToInventory={handleAddToInventory} inventory={inventory} />
                        ))}
                    </div>

                    <div className="mt-6 flex max-sm:flex-col max-sm:space-y-2 items-center justify-between border-t border-gray-700 pt-4">
                        <p className="text-sm text-gray-400">
                            Showing {startIndex} to {endIndex} of {totalProducts} results
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-gray-400">Previous</span>
                            <span className='px-2'>{currentPage}</span>
                            <span className="text-gray-400">Next</span>
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const SearchResults = ({ results, handleAddToInventory, inventory, navigate }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4 text-white">Search Results</h3>
            {results.length === 0 ? (
                <div className="text-center">
                    <p className="text-white text-2xl mb-4">No products found.</p>
                    <p className="text-gray-400">
                        Could not find item you're looking for? {' '}
                        <span className="text-teal-500 cursor-pointer" onClick={() => navigate("new")}>add it to general products list</span>
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {results.map((item) => (
                        <ProductCard
                            key={item.product.id}
                            product={item.product}
                            handleAddToInventory={handleAddToInventory}
                            inventory={inventory}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ProductList() {
    const [selectedSubCategory, setSelectedSubCategory] = useState('All Categories');
    const [inventory, setInventory] = useState([])
    const [products, setProducts] = useState([]);

    const [specificProducts, setSpecificProducts] = useState([]);
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const vendor = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (vendor.userType !== "vendor") {
            navigate(-1);
            return;
        }
        axios.get(`/api/inventory/products`)
            .then(res => {
                const data = res.data.data;
                setInventory(data)
            })
            .catch(e => console.error(e.response.data.message));

        if (selectedSubCategory === "All Categories") {
            axios.get(`/api/product/sample`)
                .then(res => {
                    const data = res.data.data;
                    setProducts(data);
                    setSpecificProducts([]); // Clear specific products when showing all categories
                })
                .catch(e => {
                    console.error(e.response?.data?.message);
                });
        } else {
            axios.get(`/api/product/specific/${selectedSubCategory}/${page}`)
                .then(res => {
                    const data = res.data.data;
                    setTotal(data?.totalProducts)
                    setSpecificProducts(data?.products || []); // Use specific products from response
                })
                .catch(e => {
                    console.error(e.response?.data?.message);
                });
        }
        setLoading(false);
    }, [selectedSubCategory]);

    const handleSearch = () => {
        setSearchResults([])
        axios.get(`/api//product/search?searchTerm=${searchTerm}`)
            .then(res => {
                const data = res.data.data;
                setSearchResults(data);
                setSelectedSubCategory('Search Results');  // This will trigger the display of search results
            })
            .catch(e => console.error(e.response.data.message));
    };

    const handleAddToInventory = (id) => {
        axios.post(`/api/inventory/add`, { product: id })
            .then(res => {
                const data = res.data.data;
                Swal.fire({
                    title: "Product added to inventory",
                    timer: 1200,
                    icon: 'success',
                    background: '#1a1a2e',
                    width: '400px',
                    heightAuto: false,
                    color: "white"
                });
                setInventory(prevInventory => [...prevInventory, id])
            })
            .catch(e => console.error(e.response.data.message));
    };

    if (loading) return <Loading />;

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

            {selectedSubCategory === "All Categories" ? (
                <AllCategories
                    products={products}
                    handleAddToInventory={handleAddToInventory}
                    inventory={inventory}
                    setSelectedSubCategory={setSelectedSubCategory}
                />
            ) : selectedSubCategory === "Search Results" ? (
                <SearchResults
                    results={searchResults}
                    handleAddToInventory={handleAddToInventory}
                    inventory={inventory}
                    navigate={navigate}
                />
            ) : (
                <SpecificCategory
                    specificProducts={specificProducts}
                    handleAddToInventory={handleAddToInventory}
                    inventory={inventory}
                    navigate={navigate}
                    selectedSubCategory={selectedSubCategory}
                    totalProducts={total}
                    currentPage={page}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}

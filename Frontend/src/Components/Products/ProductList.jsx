import { useState, useEffect } from 'react';
import { Search, Plus, ArrowRight, Edit, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Loading from "../AppPages/Loading";
import Swal from 'sweetalert2';
import axios from 'axios';
import { AllCategories, SearchResults, SpecificCategory } from './ProductComps';

const dailyNeeds = ["Packaged Food", "Dairy Products", "Beverages", "Personal Care", "Home Essentials"];


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

    const user = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true)
        // Getting inventory products to check if prod exists
        if (user.userType == "vendor") {
            axios.get(`/api/inventory/products`)
                .then(res => {
                    const data = res.data.data;
                    setInventory(data)
                })
                .catch(e => console.error(e.response.data.message));
        }

        // Getting ALl Category products or specific category products conditionally
        if (selectedSubCategory === "All Categories") {
            axios.get(`/api/product/sample`)
                .then(res => {
                    const data = res.data.data;
                    setProducts(data);
                    setSpecificProducts([]);
                    setLoading(false);
                })
                .catch(e => {
                    console.error(e.response?.data?.message);
                });
        } else {
            axios.get(`/api/product/specific/${selectedSubCategory}/${page}`)
                .then(res => {
                    const data = res.data.data;
                    setTotal(data?.totalProducts)
                    setSpecificProducts(data?.products || [])
                    setLoading(false);
                })
                .catch(e => {
                    console.error(e.response?.data?.message);
                });
        }
    }, [selectedSubCategory]);

    const handleSearch = () => {
        setSearchResults([])
        axios.get(`/api/product/search?searchTerm=${searchTerm}`)
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
            <h1 className="text-3xl font-bold mb-6">
                {user.userType == "vendor" ? "Add Product" : "All Products"}
            </h1>

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

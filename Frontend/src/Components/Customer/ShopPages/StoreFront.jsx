import React, { useState, useEffect } from 'react';
import { Search, Info, MapPin, ArrowRightLeft, Truck } from 'lucide-react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../AppPages/Loading';
import AddToCartModal from './AddToCartModal';

export default function StoreFront() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    const customer = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const vendor = location.state;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (customer.userType !== "customer" || !vendor) {
            navigate(-1);
        } else {
            Promise.all([
                axios.get(`/api/inventory/vendor/${vendor._id}`),
                axios.get(`/api/customer/cart/items/${vendor._id}`)
            ])
                .then(([inventoryRes, cartRes]) => {
                    const inventoryData = inventoryRes.data.data.productList;
                    const cartData = cartRes.data.data;

                    const cartMap = cartData.reduce((acc, item) => {
                        acc[item.product] = item.count;
                        return acc;
                    }, {});

                    const updatedProducts = inventoryData.map(product => ({
                        ...product,
                        inCart: cartMap[product.product._id] || 0
                    }));

                    setProducts(updatedProducts);
                    setFilteredProducts(updatedProducts);
                    setCart(cartMap);
                })
                .catch(e => console.error(e.response?.data));
            setLoading(false);
        }
    }, [vendor]);

    // Sorting available categories
    const categories = products.reduce((acc, cur) => {
        if (!acc.includes(cur.product.subCategory)) acc.push(cur.product.subCategory);
        return acc;
    }, []);

    const handleAddToCart = (product) => {
        setSelectedProduct({
            ...product,
            cartCount: cart[product.product._id] || 0
        });
        setIsModalOpen(true);
    };

    // Searching and sorting products 
    useEffect(() => {
        const filterProducts = () => {
            let filtered = products;

            if (searchTerm) {
                filtered = filtered.filter(product => 
                    product.product.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (selectedCategory !== "All Categories") {
                filtered = filtered.filter(product => product.product.subCategory === selectedCategory);
            }

            setFilteredProducts(filtered);
        };

        filterProducts();
    }, [searchTerm, selectedCategory, products]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };


    if (loading) return <Loading />;

    return (
        <div className="p-4 bg-black/20 shadow-2xl shadow-black/60 min-h-screen text-white rounded-lg">
            <div className="w-full flex flex-col xl:flex-row xl:justify-between items-start pb-4 mx-2 border-b border-b-gray-600 max-xl:space-y-5">
                <div className='hover:bg-gray-700 xl:w-3/5 w-full cursor-pointer rounded-lg p-1' onClick={() => navigate(`/shops/vendor/${vendor._id}`)}>
                    <h3 className="sm:text-2xl text-2xl font-bold text-yellow-500 mb-3 line-clamp-1 max-sm:line-clamp-2">
                        {vendor.shopName}
                    </h3>
                    <div className="flex max-sm:flex-col max-sm:space-y-3 sm:justify-between text-gray-400 text-sm font-semibold">
                        <div className='flex max-sm:flex-col max-sm:space-y-2 sm:space-x-5'>
                            <span>
                                <MapPin size={20} className='inline-flex me-2' />
                                Location: {vendor.location.area}
                            </span>
                            <span>
                                <ArrowRightLeft size={20} className='inline-flex me-2' />
                                {vendor.returnPol}
                            </span>
                            <span>
                                <Truck size={20} className='inline-flex me-2' />
                                Delivery {vendor.delivery ? "available" : "not available"}
                            </span>
                        </div>
                        <button
                            className={`
                                border rounded-md sm:w-20 text-center p-1.5 m-1 -mt-2
                                ${vendor.isOpen ? 'bg-green-600 text-black' : 'bg-red-600 text-white'}
                            `}
                        >
                            {vendor.isOpen ? "OPEN" : "CLOSED"}
                        </button>
                    </div>
                </div>
                <div className="mx-1 xl:w-3/6 w-full xl:border-l xl:ps-2 xl:border-l-gray-600">
                <div className='flex items-center sm:space-x-2 max-sm:flex-col max-sm:space-y-2'>
                    <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg ps-2 pe-1 py-1 w-full xl:w-96">
                        <input
                            type="text"
                            className="flex-grow bg-transparent px-2 text-white outline-none placeholder-gray-500"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            title="Search"
                            className="flex items-center justify-center h-10 w-10 bg-gray-800 rounded-full"
                        >
                            <Search size={20} className="text-white" />
                        </button>
                    </div>
                    <select
                        className="flex items-center max-sm:w-full text-md rounded-lg font-medium cursor-pointer bg-gray-800 text-white p-3 border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="All Categories">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                    <div className='flex justify-center mt-2 -mb-2 text-teal-500 hover:text-teal-600 font-semibold cursor-pointer'>
                        <p>Place custom order without any products</p>
                    </div>
                </div>
            </div>
            <div className="pb-4 mt-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((prod) => (
                    <div
                        key={prod._id || prod.product._id}
                        className="flex flex-col md:flex-row bg-gray-800 shadow-md rounded-lg overflow-hidden border border-black/20 hover:border-white mx-2 p-4 "
                    >
                        <div className='md:me-2 md:pe-2 flex justify-center'>
                            <img src={prod.product.image} className='h-40 w-44 rounded-md object-cover' alt={prod.product.name} />
                        </div>

                        <div className='flex flex-col w-full'>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl max-w-[270px] font-bold line-clamp-2 text-white" title={prod.product.name}>
                                        {prod.product.name}
                                    </h4>
                                    <p className="text-sm text-gray-300">{prod.product.subCategory}</p>
                                </div>
                                <div className="relative bottom-2 ms-1">
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
                                        {prod.description}
                                    </div>
                                </div>
                            </div>
                            <p className="text-lg font-semibold mt-2 text-teal-400">
                                {"₹" + prod.price}
                            </p>
                            <p className={`text-sm mt-2 ${prod.stock ? 'text-green-400' : 'text-red-400'}`}>
                                {prod.stock ? 'In Stock' : 'Out of Stock'}
                            </p>
                            <div className="flex justify-end mt-auto">
                                <button
                                    className={`w-full mt-4  ${prod.inCart ? "bg-green-500 hover:bg-green-600" : "bg-teal-500 hover:bg-teal-600"} text-black text-lg font-semibold py-1.5 px-4 rounded-md transition-colors`}
                                    disabled={!prod.stock}
                                    onClick={() => handleAddToCart(prod)}
                                >
                                    {prod.inCart > 0 ? `${prod.inCart} in cart` : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <AddToCartModal
                isOpen={isModalOpen}
                vendor={vendor._id}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                updateCart={(productId, newCount) => {
                    setCart(prev => ({ ...prev, [productId]: newCount }));
                    setProducts(prev => prev.map(p =>
                        p.product._id === productId ? { ...p, inCart: newCount } : p
                    ));
                }}
            />
        </div>
    );
}
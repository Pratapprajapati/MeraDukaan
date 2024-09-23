import { useState, useEffect } from 'react';
import { Search, Edit, Info, Check, X, Trash } from 'lucide-react';
import Swal from 'sweetalert2';
import img from "../assets/img1.webp";
import { products } from '../Listings/sampleData';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';


export default function Inventory() {
    const [editableProducts, setEditableProducts] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    const vendor = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        vendor.userType != "vendor" ? navigate(-1) : null
        axios.get(`/api/inventory/vendor/${vendor._id}`)
            .then(res => {
                const data = res.data.data.productList;
                // console.log(data);
                setEditableProducts(data)
            })
            .catch(e => console.error(e.response.data));
        setLoading(false)
    }, [])

    // Sorting available categories
    const categories = editableProducts.reduce((acc, cur) => {
        if (!acc.includes(cur.product.subCategory)) acc.push(cur.product.subCategory)
        return acc
    }, [])

    const handleEditToggle = (id) => {
        setEditMode(editMode === id ? null : id);
    };

    const handleFieldChange = (id, field, value) => {
        setEditableProducts((prev) =>
            prev.map((product) =>
                product.product._id === id ? { ...product, [field]: value } : product
            )
        );
    };

    const handleSave = (id) => {
        // Find the updated product in the state
        const updatedProduct = editableProducts.find((product) => product.product._id === id);

        const productData = {
            price: updatedProduct.price,
            description: updatedProduct.description,
            stock: updatedProduct.stock,
        };

        // Log the JSON object
        console.log(productData);

        axios.patch(`/api/inventory/product/${id}`, productData)
            .then((res) => {
                console.log(res.data.data)
                Swal.fire({
                    title: 'Saved!',
                    text: 'Your changes have been saved.',
                    icon: 'success',
                    color: 'white',
                    background: '#1a1a2e',
                });
            })
            .catch((e) => {
                console.error(e.response.data);
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong.',
                    icon: 'error',
                    color: 'white',
                    background: '#1a1a2e',
                });
            });

        setEditMode(null);  // Exit edit mode after saving
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this product?',
            icon: 'warning',
            color: 'white',
            background: '#1a1a2e',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/inventory/product/${id}`)
                    .then(res => {
                        // Remove the deleted product from the state
                        setEditableProducts(prev =>
                            prev.filter(product => product.product._id !== id)
                        );
    
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Product has been deleted.',
                            icon: 'success',
                            color: 'white',
                            background: '#1a1a2e',
                        });
                    })
                    .catch(e => {
                        console.error(e.response.data);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to delete the product.',
                            icon: 'error',
                            color: 'white',
                            background: '#1a1a2e',
                        });
                    });
            }
        });
        setEditMode(false)
    };    

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const filteredProducts = selectedCategory === "All Categories"
        ? editableProducts
        : editableProducts.filter((product) => product.product.subCategory === selectedCategory);

    if (loading) return <Loading />

    return (
        <div className="p-4 bg-black/20 shadow-2xl shadow-black/60 min-h-screen text-white rounded-lg">
            <h1 className='text-3xl font-semibold mb-6'>Inventory</h1>
            <div className=" mx-1 w-full ">
                <div className='flex max-sm:flex-col max-sm:space-y-2 items-center md:space-x-2 mb-6'>
                    <div className="flex items-center bg-gray-900 rounded-lg ps-2 pe-1 py-1 w-full border border-gray-800">
                        <input
                            type="text"
                            className="flex-grow bg-transparent px-2  text-white outline-none placeholder-gray-500"
                            placeholder="Search"
                        />
                        <button title="Search"
                            className="flex items-center justify-center h-10 w-10 bg-gray-800 rounded-full"
                        >
                            <Search size={20} className="text-white" />
                        </button>
                    </div>
                    <select
                        className="flex max-sm:w-full items-center text-md rounded-lg font-medium cursor-pointer bg-gray-800 text-white py-3 border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transform hover:scale-105 transition-transform"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="All Categories" key={"all"}>All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="pb-4 mt-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((prod) => (
                    <div
                        key={prod._id || prod.product._id}
                        className="flex flex-col md:flex-row bg-gray-800 shadow-md rounded-lg overflow-hidden border border-black/20 hover:border-white mx-2 p-4 "
                    >
                        <div className='md:me-2 md:pe-2'>
                            <img src={prod.product.image} className='h-32 w-40 rounded-md obje' alt={prod.product.name} />
                        </div>

                        <div className='flex flex-col w-full'>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl max-w-[270px] font-bold line-clamp-2 text-white" title={prod.product.name}>
                                        {prod.product.name}
                                    </h4>
                                    <p className="text-sm text-gray-300">{prod.product.subCategory}</p>
                                </div>
                                {editMode === prod.product._id ? (
                                    <div className="relative bottom-3 ms-1">
                                        <button
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => handleDelete(prod.product._id)}
                                        >
                                            <Trash size={20} />
                                        </button>
                                    </div>

                                ) : (
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
                                )}
                            </div>

                            {editMode === prod.product._id ? (
                                <>
                                    <input
                                        className="text-lg text-teal-400 mt-2 bg-gray-700 rounded p-1 "
                                        value={prod.price}
                                        onChange={(e) => handleFieldChange(prod.product._id, 'price', e.target.value)}
                                    />
                                    <textarea
                                        className="text-sm text-gray-300 mt-2 bg-gray-700 rounded p-1 "
                                        value={prod.description}
                                        onChange={(e) => handleFieldChange(prod.product._id, 'description', e.target.value)}
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <select
                                            className="text-lg font-medium bg-gray-700 rounded p-1 text-white"
                                            value={prod.stock ? 'In Stock' : 'Out of Stock'}
                                            onChange={(e) => handleFieldChange(prod.product._id, 'stock', e.target.value === 'In Stock')}
                                        >
                                            <option value="In Stock">In Stock</option>
                                            <option value="Out of Stock">Out of Stock</option>
                                        </select>
                                        <div className="flex space-x-2">
                                            <button
                                                className="p-1 text-green-500"
                                                onClick={() => handleSave(prod.product._id)}
                                            >
                                                <Check size={24} />
                                            </button>
                                            <button
                                                className="p-1 text-red-500"
                                                onClick={() => handleEditToggle(prod.product._id)}
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg font-semibold mt-2 text-teal-400">
                                        {"₹" + prod.price}
                                    </p>
                                    <p className={`text-sm mt-2 ${prod.stock ? 'text-green-400' : 'text-red-400'}`}>
                                        {prod.stock ? 'In Stock' : 'Out of Stock'}
                                    </p>
                                    <div className="flex justify-end mt-auto">
                                        <button
                                            className="text-sm text-blue-500 font-semibold hover:underline"
                                            onClick={() => handleEditToggle(prod.product._id)}
                                        >
                                            <Edit size={16} className="inline-block mr-1" /> Edit
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

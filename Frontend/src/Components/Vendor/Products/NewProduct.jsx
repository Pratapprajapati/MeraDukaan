import { useState, useEffect } from 'react';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import Loading from '../../AppPages/Loading';

export default function NewProduct() {
    const [image, setimage] = useState(null);
    const [content, setContent] = useState({
        name: "",
        category: "dailyNeeds",
        subCategory: "Packaged Food",
        price: 0,
        description: "",
        inStock: true,
    });

    const vendor = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        vendor.userType != "vendor" ? navigate(-1) : null
        setLoading(false)
    }, [])

    const handleimageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setimage(reader.result);
            };
            reader.readAsDataURL(file);
        }
        setContent({ ...content, image: file });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContent({
            ...content,
            [name]: value
        });
    };

    const handleAddToInventory = async () => {
        setLoading(true);

        try {
            // First Axios call with FormData
            const formData = new FormData();
            formData.append('name', content.name);
            formData.append('category', content.category);
            formData.append('subCategory', content.subCategory);
            formData.append('price', content.price);
            formData.append('image', content.image);

            const productResponse = await axios.post('/api/product/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Check if the response contains the expected data
            if (!productResponse.data || !productResponse.data.data || !productResponse.data.data._id) {
                throw new Error('Invalid response from product creation');
            }

            const productId = productResponse.data.data._id;

            // Second Axios call to add to inventory
            await axios.post(`/api/inventory/add`, {
                product: productId,
                stock: content.inStock,
                description: content.description
            });

            Swal.fire({
                title: "Product successfully added to your inventory",
                timer: 1200,
                icon: 'success',
                background: '#1a1a2e',
                width: '400px',
                heightAuto: false,
                color: "white"
            });

            navigate(-1);
        } catch (error) {
            console.error('Error adding product:', error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "An error occurred while adding the product",
                icon: 'error',
                background: '#1a1a2e',
                width: '400px',
                heightAuto: false,
                color: "white"
            });
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <Loading />

    return (
        <section className="overflow-hidden">
            <div className="mx-auto max-w-5xl px-5 py-24">
                <div className="mx-auto flex flex-wrap flex-row max-sm:flex-col items-start lg:w-4/5">
                    {/* Left Column: Image and Vendor Instructions */}
                    <div className="flex flex-col items-center lg:w-1/2">
                        {/* Image Upload Section */}
                        <div className="relative">
                            {image ? (
                                <img
                                    src={image}
                                    alt="image"
                                    className="h-full w-full max-h-96 max-w-96 rounded-lg border border-gray-600 object-cover my-auto"
                                />
                            ) : (
                                <label className="h-80 w-80 max-h-96 max-w-96 flex items-center justify-center border border-dashed border-gray-500 rounded-lg cursor-pointer text-gray-400">
                                    Click to add image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleimageChange}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Vendor Instructions */}
                        <ol className="mt-4 text-sm text-gray-400 text-left list-disc space-y-4">
                            <li>Name, categories, and image will be shared with all vendors.</li>
                            <li>You can only change the description, stock, and price later as it is specific to your store.</li>
                            <li>Price to be entered should be the MRP of the product, which you can update later as you please for your store.</li>
                        </ol>
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:pl-10">
                        {/* Name Field */}
                        <div className="flex flex-col space-y-3">
                            <label className="block text-sm font-medium text-gray-400">Product Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={content.name}
                                onChange={handleInputChange}
                                placeholder="Enter product name"
                                className="text-lg px-2 py-1 text-gray-200 bg-transparent border border-gray-700 rounded-lg"
                            />
                        </div>

                        {/* Category and Sub-Category Fields */}
                        <div className="flex flex-col mt-5 space-y-3">
                            <label className="block text-sm font-medium text-gray-400">Category:</label>
                            <select
                                name="category"
                                value={content.category}
                                onChange={handleInputChange}
                                className="bg-gray-800 text-white py-2 px-3 rounded-md border border-gray-700"
                            >
                                <option value="dailyNeeds">Daily Needs</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-400">Sub-Category:</label>
                            <select
                                name="subCategory"
                                value={content.subCategory}
                                onChange={handleInputChange}
                                className="bg-gray-800 text-white py-2 px-3 rounded-md border border-gray-700"
                            >
                                <option value="Packaged Food">Packaged Food</option>
                                <option value="Dairy Products">Dairy Products</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Personal Care">Personal Care</option>
                                <option value="Home Essentials">Home Essentials</option>
                                <option value="Household Items">Household Items</option>
                            </select>
                        </div>

                        <hr className="my-6 border-t border-gray-700" />

                        {/* Price, Description, and Stock Toggle */}
                        <div className="flex flex-col space-y-3">
                            <label className="block text-sm font-medium text-gray-400">Item Description:</label>
                            <textarea
                                name="description"
                                value={content.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 w-full text-lg px-2 py-1 text-gray-200 bg-transparent border border-gray-700 rounded-lg resize-none"
                                placeholder="Enter item description"
                            />

                            <div className="my-5 flex items-center pb-5">
                                <div className='w-[50%]'>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Price:</label>
                                    <span className="title-font text-xl font-bold text-gray-300">
                                        ₹<input
                                            type="number"
                                            name="price"
                                            value={content.price}
                                            onChange={handleInputChange}
                                            className='w-24 ml-1 bg-transparent border border-gray-950/50 rounded-md px-1 focus:outline-none focus:border-b focus:border-b-white focus:rounded-none'
                                        />
                                    </span>
                                </div>
                                <div className='w-[50%]'>
                                    <label className="block text-sm mb-3 font-medium text-gray-400">Product in Stock:</label>
                                    <Toggle
                                        id="stock"
                                        name="stock"
                                        checked={content.inStock}
                                        onChange={() => setContent({ ...content, inStock: !content.inStock })}
                                        className="align-middle"
                                    />
                                    <span className="ml-2 text-sm text-gray-300">
                                        {content.inStock ? "In Stock" : "Out of Stock"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Add to Inventory Button */}
                        <div className="w-full">
                            <button
                                type="button"
                                onClick={handleAddToInventory}
                                className="rounded-md w-full bg-teal-500 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-teal-500/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                            >
                                Add to Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
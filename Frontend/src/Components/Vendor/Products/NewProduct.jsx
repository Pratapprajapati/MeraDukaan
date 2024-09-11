import React, { useState } from 'react';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

export default function NewProduct() {
    const [thumbnail, setThumbnail] = useState(null);
    const [content, setContent] = useState({
        name: "",
        category: "dailyNeeds",
        subCategory: "Packaged Food",
        price: 0,
        description: "",
        inStock: true,
    });

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        }
        setContent({ ...content, thumbnail: file });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContent({
            ...content,
            [name]: value
        });
    };

    const handleToggleChange = () => {
        setContent({
            ...content,
            inStock: !content.inStock
        });
    };

    return (
        <section className="overflow-hidden">
            <div className="mx-auto max-w-5xl px-5 py-24">
                <div className="mx-auto flex flex-wrap flex-row max-sm:flex-col items-start lg:w-4/5">
                    {/* Left Column: Image and Vendor Instructions */}
                    <div className="flex flex-col items-center lg:w-1/2">
                        {/* Image Upload Section */}
                        <div className="relative">
                            {thumbnail ? (
                                <img
                                    src={thumbnail}
                                    alt="Thumbnail"
                                    className="h-full w-full max-h-96 max-w-96 rounded-lg border border-gray-600 object-cover my-auto"
                                />
                            ) : (
                                <label className="h-80 w-80 max-h-96 max-w-96 flex items-center justify-center border border-dashed border-gray-500 rounded-lg cursor-pointer text-gray-400">
                                    Click to add image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleThumbnailChange}
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
                                        ₹<input type="number" className='w-24 ml-1 bg-transparent border border-gray-950/50 rounded-md px-1 focus:outline-none focus:border-b focus:border-b-white focus:rounded-none' />
                                    </span>
                                </div>
                                <div className='w-[50%]'>
                                    <label className="block text-sm mb-3 font-medium text-gray-400">Product in Stock:</label>
                                    <Toggle
                                        id="stock"
                                        name="stock"
                                        checked={content.inStock}
                                        onChange={() => setContent({...content, inStock: !content.inStock})}
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

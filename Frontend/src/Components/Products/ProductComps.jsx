import { Plus, ArrowRight, Edit, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

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

const ProductCard = ({ product, handleAddToInventory, inventory, }) => {
    const user = useOutletContext();
    const userType = user.userType
    const navigate = useNavigate();
    const exists = inventory.includes(product.id)

    return (
        <div className="bg-gray-800 w-72 rounded-lg overflow-hidden shadow-lg shadow-black/30 flex-shrink-0 border border-black/40 hover:border-gray-400">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-4 bg-gray-950">
                <h4 className="text-lg font-semibold text-white mb-1">{product.name}</h4>
                <p className="text-sm text-gray-400 mb-1">{product.subCategory}</p>
                {
                    userType === "vendor" ? (
                        <div>
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
                                            onClick={() => handleAddToInventory(product.id)}
                                        >
                                            <Plus size={14} className="mr-1 inline" /> Quick Add
                                            <div className="absolute hidden group-hover:block w-48 p-2 text-xs text-white bg-black rounded-lg shadow-lg left-24 -translate-x-1/2 bottom-full mb-2 z-10">
                                                Quickly add this item to your inventory
                                            </div>
                                        </Button>
                                        <Button
                                            className="flex-1 relative group"
                                            onClick={() => navigate("add", { state: product })}
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
                    ) : (
                        <div>
                            <Button className={`w-full mt-2 py-1.5 text-lg font-semibold`} onClick={() => navigate("shops", {state: product})}>
                                Sold by {product.vendors.length} shops
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export const AllCategories = ({ products, handleAddToInventory, inventory, setSelectedSubCategory }) => (
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

export const SpecificCategory = ({ specificProducts, handleAddToInventory, inventory, navigate, selectedSubCategory, currentPage, totalProducts, onPageChange }) => {
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 place-items-center">
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

export const SearchResults = ({ results, handleAddToInventory, inventory, navigate }) => {
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
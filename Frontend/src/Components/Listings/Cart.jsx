import { ShoppingCart } from "lucide-react";

const vendors = [
    {
        id: 1,
        shopName: 'Local Shop 1',
        shopAddress: '123 Market St, City, State',
        products: [
            { name: 'Nike Air Force 1 07 LV8', price: '₹61,999' },
            { name: 'Nike Run Division, Airmax Pro Ultra Mens Runnig Shoes', price: '₹22,500' },
            { name: 'Product 3', price: '₹9,999' },
            { name: 'Product 4', price: '₹12,000' },
            { name: 'Product 5', price: '₹3,000' },
        ],
        total: '₹1,09,498',
    },
    {
        id: 2,
        shopName: 'Local Shop 2',
        shopAddress: '456 High St, City, State',
        products: [
            { name: 'Product 1', price: '₹12,000' },
            { name: 'Product 2', price: '₹9,500' },
            { name: 'Product 3', price: '₹3,999' },
        ],
        total: '₹25,499',
    },
];

export default function Cart() {
    return (
        <div className="mx-auto my-4 max-w-6xl px-2 md:my-6 md:px-0">
            <h2 className="text-3xl font-bold text-teal-500 flex items-end">
                <ShoppingCart className="inline-flex w-10 h-10 me-2 items-start"/>Your Cart
            </h2>
            <div className="mt-3  text-gray-300">
                Your cart items are sorted according to their respective vendors
            </div>
            <div className="mt-8 flex flex-col space-y-8">
                {vendors.map((vendor) => (
                    <div key={vendor.id} className="flex flex-col bg-gray-900 shadow-lg shadow-black/40 overflow-hidden rounded-lg  md:flex-row">
                        <div className="w-2/5 border-r my-2 border-gray-400">
                            <div className="p-8">
                                <div className="flex flex-col space-y-3">
                                    <div className="mb-4">
                                        <div className="text-2xl font-bold text-yellow-500 line-clamp-2 mb-4">{vendor.shopName} horse riding school</div>
                                        <div className="text-md font-medium text-gray-400 mt-2 line-clamp-3">{vendor.shopAddress}fhvhjfrhjgrhf rhbgrghbghbrghkrbggeeg bjkgegkg hkbghkegg</div>
                                        <div className="text-md font-medium text-gray-400 mt-2 line-clamp-3">New York - 100009</div>
                                    </div>
                                    <div className="text-lg font-medium text-black flex justify-center">
                                        <button className='bg-yellow-600 w-full font-semibold px-5 py-2 rounded-md transform hover:scale-90 transition-transform'>
                                            View Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-between">
                            <div>
                                <h1 className='text-lg'>Cart Items</h1>
                                <ul className="mt-4 text-sm font-medium text-gray-400 list-disc list-inside">
                                    {vendor.products.slice(0, 3).map((product, index) => (
                                        <li key={index}>
                                            {product.name} - {product.price}
                                        </li>
                                    ))}
                                    {vendor.products.length > 3 && (
                                        <li>...and {vendor.products.length - 3} other items</li>
                                    )}
                                </ul>
                            </div>
                            <div className="mt-auto"> {/* Ensures that the following content is pushed to the bottom */}
                                <hr className="my-2 border-t border-t-gray-200" />
                                <div className="text-right">
                                    <h3 className="text-2xl font-bold text-teal-500">Total: <span className='text-yellow-500'>{vendor.total}</span></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

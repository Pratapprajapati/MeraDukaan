import { Trash } from 'lucide-react';
import { useLocation } from 'react-router-dom';


export function Total({ products, bill }) {
    return (
        <div className="mt-3 bg-black/30 p-4 rounded-lg">
            <div className="flex justify-between text-xl text-white">
                <p>Total Products: <span className='text-yellow-500'>{products}</span></p>
                <p>Total Bill: <span className='text-yellow-500 font-semibold'>{bill}</span></p>
            </div>
        </div>
    )
}

export default function Cart({ orderItems = [] }) { // Default to an empty array
    const path = useLocation();
    const place = path.pathname.includes("place");

    return (
        <div className="bg-black/20 text-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-teal-500 mb-4">Cart Items</h2>
            <div className="max-h-[600px] overflow-y-auto space-y-4">
                {orderItems.length > 0 ? ( // Check if orderItems has elements
                    orderItems.map((item) => (
                        <div key={item.product._id} className="bg-black/20 text-gray-900 rounded-lg shadow-sm cursor-pointer">
                            <div className="flex py-4 ps-4">
                                <div className="flex-shrink-0">
                                    <img 
                                        src={item.product.image} 
                                        alt={item.product.name} 
                                        className="h-16 w-16 object-cover rounded-md" 
                                    />
                                </div>
                                <div className="px-5 flex flex-1 flex-col justify-between">
                                    <div className='flex justify-between items-center -mt-2'>
                                        <h3 className="text-lg font-semibold text-white">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-lg text-yellow-400 font-medium">
                                            Total: ₹{item.total}
                                        </p>
                                    </div>
                                    <h1 className='text-gray-400 text-sm mb-1'>Category: {item.product.subCategory}</h1>
                                    {
                                        place ? (
                                            <div className="mt-2 flex">
                                                <div className="min-w-24 flex">
                                                    <button type="button" className="h-7 w-7 bg-gray-700 text-white rounded-md">-</button>
                                                    <input disabled
                                                        type="text"
                                                        className="mx-1 h-7 w-9 rounded-md border-gray-700 bg-gray-800 text-center text-white"
                                                        defaultValue={item.count}
                                                    />
                                                    <button type="button" className="h-7 w-7 bg-gray-700 text-white rounded-md">+</button>
                                                </div>
                                                <div className="ml-6 flex text-sm">
                                                    <button type="button" className="flex items-center space-x-1 px-2 py-1">
                                                        <Trash size={12} className="text-red-400" />
                                                        <span className="text-xs font-medium text-red-400">Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <h1 className='text-gray-400 text-sm'>Quantity: <span className='text-lg text-white'>{item.count}</span></h1>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No items in the cart.</p> // Message when there are no items
                )}
            </div>
        </div>
    );
}


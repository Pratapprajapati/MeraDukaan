import { useState } from 'react';

const orders = [
    {
        id: 1,
        date: '2024-08-15',
        numberOfOrders: 3,
        total: '₹5,499',
        vendor: 'Local Shop 1',
    },
    {
        id: 2,
        date: '2024-08-12',
        numberOfOrders: 2,
        total: '₹2,999',
        vendor: 'Local Shop 2',
    },
    {
        id: 3,
        date: '2024-08-10',
        numberOfOrders: 5,
        total: '₹7,850',
        vendor: 'Local Shop 3',
    },
    // Add more orders as needed
];

export default function Customer () {

    const [details, setDetails] = useState({
        username: "johndoe",
        email: "johndoe@example.com",
        contact: {
            primary: "1234567890",
            secondary: "0987654321",
        },
        location: {
            city: "New York",
            address: "123 Main St",
            pincode: "10001",
        },
    });

    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Details Section */}
                <div className="bg-black/10 text-gray-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-teal-500 mb-4">Personal Details</h2>
                    <div className="space-y-6">
                        <div className="flex flex-row space-x-20">
                            <div className='space-y-4'>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Username:</label>
                                    <h1 className="mt-1 text-lg text-gray-200 bg-transparent">{details.username}</h1>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Email:</label>
                                    <input
                                        className={`mt-1 text-lg px-1 text-gray-200 bg-transparent ${isEditing ? "border-b border-gray-100" : null}`}
                                        disabled={!isEditing}
                                        value={details.email}
                                        onChange={e => setDetails({ ...details, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            {
                                isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400">New Password</label>
                                            <input
                                                className={`mt-1 text-lg px-1 text-gray-200 bg-transparent ${isEditing ? "border-b border-gray-100" : null}`}
                                                type='password'
                                                disabled={!isEditing}
                                                value={details.newPassword}
                                                onChange={e => setDetails({ ...details, newPassword: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400">Old Password</label>
                                            <input
                                                className={`mt-1 text-lg px-1 text-gray-200 bg-transparent ${isEditing ? "border-b border-gray-100" : null}`}
                                                type='password'
                                                disabled={!isEditing}
                                                value={details.oldPassword}
                                                onChange={e => setDetails({ ...details, oldPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400">Contact:</label>
                            <table className="table-auto text-left text-base text-gray-300">
                                <tbody>
                                    <tr>
                                        <td className="pr-4">Primary:</td>
                                        <td>
                                            <input
                                                className={`mt-1 text-lg px-1 text-gray-200 bg-transparent w-[150px] ${isEditing ? "border-b border-gray-100" : null}`}
                                                disabled={!isEditing}
                                                value={details.contact.primary}
                                                onChange={e => setDetails({ ...details, contact: { ...details.contact, primary: e.target.value } })}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="pr-4">Secondary:</td>
                                        <td>
                                            <input
                                                className={`mt-1 text-lg px-1 text-gray-200 bg-transparent w-[150px] ${isEditing ? "border-b border-gray-100" : null}`}
                                                disabled={!isEditing}
                                                value={details.contact.secondary}
                                                onChange={e => setDetails({ ...details, contact: { ...details.contact, secondary: e.target.value } })}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-400">Location:</label>
                            <table className="table-auto text-left text-base text-gray-300">
                                <tbody>
                                    <tr>
                                        <td className="pr-4 flex items-start">Address:</td>
                                        <td>
                                            <input
                                                className={`mt-1 text-lg px-1 w-[450px] text-gray-200 bg-transparent resize-none ${isEditing ? "border-b border-gray-100" : null}`}
                                                disabled={!isEditing}
                                                value={details.location.address}
                                                onChange={e => setDetails({ ...details, location: { ...details.location, address: e.target.value } })}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="pr-4">City:</td>
                                        <td>
                                            <input
                                                className={`mt-1 text-lg px-1 text-gray-200 bg-transparent ${isEditing ? "border-b border-gray-100" : null}`}
                                                disabled={!isEditing}
                                                value={details.location.city}
                                                onChange={e => setDetails({ ...details, location: { ...details.location, city: e.target.value } })}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="pr-4">Pincode:</td>
                                        <td>
                                            <input
                                                className={`mt-1 text-lg px-1 text-gray-200 bg-transparent ${isEditing ? "border-b border-gray-100" : null}`}
                                                disabled={!isEditing}
                                                value={details.location.pincode}
                                                onChange={e => setDetails({ ...details, location: { ...details.location, pincode: e.target.value } })}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-teal-500 text-gray-900 rounded" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>

                {/* Order History Section */}
                <div className="bg-black/10 text-gray-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-teal-500 mb-4">Order History</h2>
                    <div className="max-h-96 overflow-y-auto space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-black/20 text-gray-900 p-4 rounded-lg shadow-sm cursor-pointer">
                                <h3 className="text-lg font-semibold text-white">Order Date: {order.date}</h3>
                                <p className="mt-2 text-gray-300">Number of Orders: {order.numberOfOrders}</p>
                                <p className="mt-2 text-gray-300">Total: {order.total}</p>
                                <p className="mt-2 text-gray-300">Vendor: {order.vendor}</p>
                            </div>
                        ))}
                    </div>
                    <p className='text-teal-500 text-lg text-center mt-4 cursor-pointer'>View complete order history</p>
                </div>
            </div>
        </div>
    );
};

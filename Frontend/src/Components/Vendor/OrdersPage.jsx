import React, { useState } from 'react';

const orders = [
    {
        id: 1,
        status: 'Pending',
        customer: {
            name: 'John Doe',
            address: '123 Main St, Springfield, New York - 10001',
            contact: '123-456-7890',
            note: 'Please deliver between 3-4 PM.'
        },
        products: [
            { name: 'Product 1', price: '$50' },
            { name: 'Product 2', price: '$30' },
            { name: 'Product 3', price: '$20' },
            { name: 'Product 4', price: '$40' },
        ],
        total: '$140',
        payment: "cash"
    },
    {
        id: 2,
        status: 'Completed',
        customer: {
            name: 'Jane Smith',
            address: '456 Elm St, Metropolis, New York - 10002',
            contact: '987-654-3210',
            note: ''
        },
        products: [
            { name: 'Product 5', price: '$100' },
            { name: 'Product 6', price: '$75' },
        ],
        total: '$175'
    },
    {
        id: 3,
        status: 'Cancelled',
        customer: {
            name: 'Bob Brown',
            address: '789 Oak St, Gotham, New York - 10003',
            contact: '456-789-0123',
            note: 'Cancelled due to late delivery.'
        },
        products: [
            { name: 'Product 7', price: '$60' },
            { name: 'Product 8', price: '$40' },
            { name: 'Product 9', price: '$25' },
        ],
        total: '$125'
    },
    {
        "id": 4,
        "status": "Pending",
        "customer": {
            "name": "Alice Johnson",
            "address": "234 Maple Ave, Rivertown, California - 90001",
            "contact": "321-654-9870",
            "note": "Leave package at the front door."
        },
        "products": [
            { "name": "Product 10", "price": "$70" },
            { "name": "Product 11", "price": "$20" }
        ],
        "total": "$90",
        "payment": "credit card"
    },
    {
        "id": 5,
        "status": "Completed",
        "customer": {
            "name": "Emily Davis",
            "address": "567 Pine St, Lakeside, Texas - 73301",
            "contact": "678-123-4567",
            "note": "Deliver after 6 PM."
        },
        "products": [
            { "name": "Product 12", "price": "$85" },
            { "name": "Product 13", "price": "$45" }
        ],
        "total": "$130"
    },
    {
        "id": 6,
        "status": "Pending",
        "customer": {
            "name": "Michael Lee",
            "address": "891 Birch Rd, Hilltown, Florida - 33101",
            "contact": "234-567-8901",
            "note": "Ring the bell upon arrival."
        },
        "products": [
            { "name": "Product 14", "price": "$55" },
            { "name": "Product 15", "price": "$65" }
        ],
        "total": "$120",
        "payment": "credit card"
    },
    {
        "id": 7,
        "status": "Cancelled",
        "customer": {
            "name": "Linda Green",
            "address": "123 Oak Ln, Brookside, Oregon - 97001",
            "contact": "789-012-3456",
            "note": "Item out of stock."
        },
        "products": [
            { "name": "Product 16", "price": "$90" },
            { "name": "Product 17", "price": "$35" }
        ],
        "total": "$125"
    },
    {
        "id": 8,
        "status": "Completed",
        "customer": {
            "name": "James Wilson",
            "address": "345 Cedar Dr, Mountainview, Arizona - 85001",
            "contact": "345-678-9012",
            "note": "Please call before delivery."
        },
        "products": [
            { "name": "Product 18", "price": "$60" },
            { "name": "Product 19", "price": "$40" },
            { "name": "Product 20", "price": "$20" }
        ],
        "total": "$120"
    },
    {
        "id": 9,
        "status": "Pending",
        "customer": {
            "name": "Olivia Martinez",
            "address": "456 Willow St, Newtown, Pennsylvania - 19101",
            "contact": "456-123-7890",
            "note": "Deliver between 10 AM and 12 PM."
        },
        "products": [
            { "name": "Product 21", "price": "$75" },
            { "name": "Product 22", "price": "$25" }
        ],
        "total": "$100",
        "payment": "cash"
    },
    {
        "id": 10,
        "status": "Cancelled",
        "customer": {
            "name": "David Thompson",
            "address": "789 Elm St, Seaside, Michigan - 48201",
            "contact": "567-890-1234",
            "note": "Customer requested cancellation."
        },
        "products": [
            { "name": "Product 23", "price": "$85" },
            { "name": "Product 24", "price": "$50" }
        ],
        "total": "$135"
    },
    {
        "id": 11,
        "status": "Completed",
        "customer": {
            "name": "Sophia Allen",
            "address": "135 Maple Rd, Fairview, Illinois - 60601",
            "contact": "678-901-2345",
            "note": "Leave in garage."
        },
        "products": [
            { "name": "Product 25", "price": "$40" },
            { "name": "Product 26", "price": "$60" },
            { "name": "Product 27", "price": "$15" }
        ],
        "total": "$115"
    },
    {
        "id": 12,
        "status": "Pending",
        "customer": {
            "name": "Daniel Robinson",
            "address": "246 Pine St, Hillcrest, Virginia - 23201",
            "contact": "789-234-5678",
            "note": "Deliver to the back porch."
        },
        "products": [
            { "name": "Product 28", "price": "$85" },
            { "name": "Product 29", "price": "$30" }
        ],
        "total": "$115",
        "payment": "credit card"
    },
    {
        "id": 13,
        "status": "Completed",
        "customer": {
            "name": "Mia Walker",
            "address": "357 Birch St, Maplewood, Georgia - 30301",
            "contact": "890-123-4567",
            "note": "Please ring the doorbell."
        },
        "products": [
            { "name": "Product 30", "price": "$90" },
            { "name": "Product 31", "price": "$45" }
        ],
        "total": "$135"
    },
    {
        "id": 14,
        "status": "Cancelled",
        "customer": {
            "name": "Ethan Young",
            "address": "468 Cedar Ave, Riverview, New Jersey - 07001",
            "contact": "901-234-5678",
            "note": "Customer moved to a new address."
        },
        "products": [
            { "name": "Product 32", "price": "$50" },
            { "name": "Product 33", "price": "$30" },
            { "name": "Product 34", "price": "$20" }
        ],
        "total": "$100"
    },
    {
        "id": 15,
        "status": "Pending",
        "customer": {
            "name": "Isabella King",
            "address": "579 Oak St, Crestview, Tennessee - 37201",
            "contact": "123-789-4560",
            "note": "Deliver after 4 PM."
        },
        "products": [
            { "name": "Product 35", "price": "$65" },
            { "name": "Product 36", "price": "$55" }
        ],
        "total": "$120",
        "payment": "cash"
    },
    {
        "id": 16,
        "status": "Completed",
        "customer": {
            "name": "Liam Adams",
            "address": "680 Elm St, Greenfield, Indiana - 46201",
            "contact": "234-567-8901",
            "note": "Please leave a receipt."
        },
        "products": [
            { "name": "Product 37", "price": "$75" },
            { "name": "Product 38", "price": "$50" },
            { "name": "Product 39", "price": "$25" }
        ],
        "total": "$150"
    },
    {
        "id": 17,
        "status": "Pending",
        "customer": {
            "name": "Charlotte Scott",
            "address": "791 Pine Ave, Norwalk, Maryland - 21201",
            "contact": "345-678-9012",
            "note": "Leave at the side door."
        },
        "products": [
            { "name": "Product 40", "price": "$80" },
            { "name": "Product 41", "price": "$20" }
        ],
        "total": "$100",
        "payment": "credit card"
    }

];

export default function Orders() {
    const [selectedStatus, setSelectedStatus] = useState('Pending');

    const filteredOrders = orders.filter(order => order.status === selectedStatus);

    return (
        <div className="bg-black/30 text-white p-6 rounded-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Orders</h2>
                <div className="flex space-x-4">
                    {['Pending', 'Cancelled', 'Completed'].map(status => (
                        <button
                            key={status}
                            className={`px-4 py-2 rounded-lg ${selectedStatus === status ? 'bg-blue-600' : 'bg-gray-700'}`}
                            onClick={() => setSelectedStatus(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="flex flex-col bg-gray-800 shadow-lg shadow-black/40 overflow-hidden rounded-lg md:flex-row border border-gray-800">
                        <div className="w-full md:w-2/6 md:border-r border-gray-700 py-3 px-4">
                            <div className="flex flex-col space-y-3">
                                <div className="text-2xl font-bold text-yellow-500">Order ID: {order.id}</div>
                                <div className="text-xl font-bold text-gray-300">{order.customer.name}</div>
                                <div className="text-md text-gray-400 space-y-2">
                                    <p><span className="font-semibold">Address:</span> {order.customer.address}</p>
                                    <p><span className="font-semibold">Contact:</span> {order.customer.contact}</p>
                                    {order.customer.note && (
                                        <p><span className="font-semibold">Note:</span> {order.customer.note}</p>
                                    )}
                                    {order.payment && (
                                        <p><span className="font-semibold">Payment:</span> {order.payment}</p>
                                    )}
                                </div>

                            </div>
                        </div>
                        <div className="flex-1 p-2 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
                                <div className="max-h-48 overflow-y-auto pr-2">
                                    <ul className="space-y-4">
                                        {order.products.map((product, index) => (
                                            <li key={index} className="flex items-center gap-4 bg-gray-700 p-2 rounded">
                                                <img
                                                    src={`/api/placeholder/64/64`}
                                                    alt={product.name}
                                                    className="h-16 w-16 rounded object-contain bg-gray-600"
                                                />
                                                <div>
                                                    <h4 className="text-sm text-gray-200">{product.name}</h4>
                                                    <dl className="mt-0.5 space-y-px text-xs text-gray-400">
                                                        <div>
                                                            <dd className="inline font-bold">{product.price}</dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4">
                                <hr className="my-2 border-t border-gray-600" />
                                <div className='flex justify-between'>
                                    <div className="text-lg font-medium text-black flex justify-center">
                                        <button className='bg-yellow-600 w-56 font-semibold px-5 py-2 rounded-md transform hover:scale-90 transition-transform'>
                                            View Order
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl font-bold">Total: <span className="text-yellow-500">{order.total}</span></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

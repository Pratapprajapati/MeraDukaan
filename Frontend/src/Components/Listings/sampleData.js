const dailyNeeds = [
    "Packaged Food",
    "Dairy Products",
    "Beverages",
    "Personal Care",
    "Home Essentials",
    "Household Items",
]

const stationery = [
    "Writing Materials",
    "Paper Products",
    "Office Supplies",
    "Art Supplies",
    "Filing and Organization",
    "School Supplies",
    "Calendars and Planners",
    "Gifts and Toys",
]

// Order details
export const cartItems = [
    {
        id: 1,
        name: 'Product 1',
        color: 'Red',
        size: 'L',
        originalPrice: '₹1,999',
        price: '₹1,499',
        discount: '25% off',
        quantity: 2,
        imageSrc: '/path/to/image1.jpg',
    },
    {
        id: 2,
        name: 'Product 2',
        color: 'Blue',
        size: 'M',
        originalPrice: '₹2,499',
        price: '₹1,999',
        discount: '20% off',
        quantity: 1,
        imageSrc: '/path/to/image2.jpg',
    },
    {
        id: 3,
        name: 'Product 1',
        color: 'Red',
        size: 'L',
        originalPrice: '₹1,999',
        price: '₹1,499',
        discount: '25% off',
        quantity: 2,
        imageSrc: '/path/to/image1.jpg',
    },
    {
        id: 4,
        name: 'Product 2',
        color: 'Blue',
        size: 'M',
        originalPrice: '₹2,499',
        price: '₹1,999',
        discount: '20% off',
        quantity: 1,
        imageSrc: '/path/to/image2.jpg',
    },
    {
        id: 5,
        name: 'Product 2',
        color: 'Blue',
        size: 'M',
        originalPrice: '₹2,499',
        price: '₹1,999',
        discount: '20% off',
        quantity: 1,
        imageSrc: '/path/to/image2.jpg',
    },
    // Add more cart items as needed
];

// For dashboard
export const orderData = {
    '7 days': {
      totalOrders: 50,
      deliveredOrders: 30,
      rejectedOrders: 5,
      incompleteOrders: 15,
      failedOrders: 2,
      revenue: 50000,
    },
    '30 days': {
      totalOrders: 200,
      deliveredOrders: 150,
      rejectedOrders: 20,
      incompleteOrders: 30,
      failedOrders: 5,
      revenue: 250000,
    },
    'All-time': {
      totalOrders: 1500,
      deliveredOrders: 1300,
      rejectedOrders: 50,
      incompleteOrders: 150,
      failedOrders: 10,
      revenue: 1500000,
    },
    '1 year': {
      totalOrders: 800,
      deliveredOrders: 700,
      rejectedOrders: 20,
      incompleteOrders: 80,
      failedOrders: 5,
      revenue: 750000,
    },
  };

export const products = [
    { id: 1, name: "Nike Air Max 90", price: "₹8,999", category: "Footwear", inStock: true, description: "The Nike Air Max 90 stays true to its OG roots with an iconic Waffle outsole." },
    { id: 2, name: "Sony WH-1000XM4", price: "₹24,990", category: "Electronics", inStock: true, description: "Industry-leading noise canceling with Dual Noise Sensor technology." },
    { id: 3, name: "Adidas Ultraboost", price: "₹14,999", category: "Footwear", inStock: false, description: "Responsive running shoes with a snug, sock-like fit." },
    { id: 4, name: "Samsung Galaxy S21", price: "₹69,999", category: "Electronics", inStock: true, description: "Pro-grade camera and 8K video for the creators." },
    { id: 5, name: "Wooden Coffee Table", price: "₹5,499", category: "Furniture", inStock: true, description: "Crafted with durable wood, perfect for your living room." },
    { id: 6, name: "Apple MacBook Air M2", price: "₹1,14,990", category: "Electronics", inStock: false, description: "Apple's thinnest and lightest notebook, completely transformed by the M2 chip." },
    { id: 7, name: "Fitbit Charge 4", price: "₹9,999", category: "Health & Wellness", inStock: true, description: "Fitbit's most advanced fitness & health tracker." },
    { id: 8, name: "IKEA Dining Set", price: "₹19,999", category: "Furniture", inStock: true, description: "Modern and minimalistic dining set perfect for family dinners." },
    { id: 9, name: "Canon EOS 1500D", price: "₹31,999", category: "Electronics", inStock: false, description: "Capture stunning images with this easy-to-use DSLR camera." },
    { id: 10, name: "Nike Dri-FIT T-Shirt", price: "₹1,199", category: "Clothing", inStock: true, description: "Lightweight and breathable T-shirt ideal for your workouts." },
    { id: 11, name: "Samsung QLED 4K TV", price: "₹89,999", category: "Electronics", inStock: true, description: "Unveil hidden details with vibrant colors in 4K resolution." },
    { id: 12, name: "Puma Running Shoes", price: "₹3,999", category: "Footwear", inStock: false, description: "Engineered for superior cushioning and grip." },
    { id: 13, name: "Reebok Yoga Mat", price: "₹1,499", category: "Sports & Fitness", inStock: true, description: "High-density mat with superior grip and comfort." },
    { id: 14, name: "Sony PlayStation 5", price: "₹49,999", category: "Electronics", inStock: false, description: "Next-gen gaming console with ultra-high-speed SSD." },
    { id: 15, name: "H&M Cotton Hoodie", price: "₹1,799", category: "Clothing", inStock: true, description: "Soft and warm hoodie made with organic cotton." },
];

export const sampleOrders = [
    { id: "ORD001", date: "2024-09-11", status: "Delivered", total: "$120.50", items: 3, customerName: "Alice Johnson" },
    { id: "ORD002", date: "2024-09-11", status: "Processing", total: "$85.00", items: 2, customerName: "Bob Smith" },
    { id: "ORD003", date: "2024-09-10", status: "Pending", total: "$200.75", items: 4, customerName: "Charlie Brown" },
    { id: "ORD004", date: "2024-09-10", status: "Cancelled", total: "$50.25", items: 1, customerName: "David Miller" },
    { id: "ORD005", date: "2024-08-26", status: "Incomplete", total: "$150.00", items: 3, customerName: "Eva Green" },
    { id: "ORD006", date: "2024-08-26", status: "Accepted", total: "$95.50", items: 2, customerName: "Frank White" },
    { id: "ORD007", date: "2024-08-13", status: "Rejected", total: "$180.25", items: 4, customerName: "Grace Lee" },
    { id: "ORD008", date: "2024-08-13", status: "Failed", total: "$75.00", items: 1, customerName: "Henry Ford" },
];

// Orders overview page
export const orders = [
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
        status: 'Delivered',
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
        status: 'Rejected',
        customer: {
            name: 'Bob Brown',
            address: '789 Oak St, Gotham, New York - 10003',
            contact: '456-789-0123',
            note: 'Rejected due to late delivery.'
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
        "status": "Delivered",
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
        "status": "Rejected",
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
        "status": "Delivered",
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
        "status": "Rejected",
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
        "status": "Delivered",
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
        "status": "Delivered",
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
        "status": "Rejected",
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
        "status": "Delivered",
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

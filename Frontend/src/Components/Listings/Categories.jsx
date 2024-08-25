

export const categories = [
    { id: 1, name: "Packaged Foods & Daily Essentials", icon: "🛒", color: "bg-orange-500 text-white" },
    { id: 2, name: "Fruits and Vegetables", icon: "🍎", color: "bg-green-500 text-white" },
    { id: 3, name: "Books and Stationary", icon: "📚", color: "bg-yellow-500 text-white" },
    { id: 4, name: "Dairy Products", icon: "🥛", color: "bg-blue-500 text-white" },
    { id: 5, name: "Electronics and Hardware", icon: "🔌", color: "bg-gray-700 text-white" },
    { id: 6, name: "Furniture and Decor", icon: "🛋️", color: "bg-purple-600 text-white" },
    { id: 7, name: "Clothing and Accessories", icon: "👗", color: "bg-pink-500 text-white" },
    { id: 8, name: "Kitchenware and Utilities", icon: "🍴", color: "bg-red-500 text-white" },
    { id: 9, name: "Gift Shop and Jewelry", icon: "🎁", color: "bg-teal-500 text-white" },
    { id: 10, name: "Kid Supplies and Toys", icon: "🧸", color: "bg-blue-400 text-white" },
    { id: 11, name: "Health and Wellness", icon: "💊", color: "bg-green-600 text-white" },
    { id: 12, name: "Sports and Fitness", icon: "🏋️‍♂️", color: "bg-indigo-500 text-white" },
];

export default function Categories() {

    return (
        <div>
            <section className=" container mx-auto mt-8">
                <div className="flex justify-between">
                    <h3 className="text-3xl font-bold text-gray-100 mb-4">
                        Product Categories
                    </h3>
                </div>
                <div className="pb-4 grid sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className={`flex flex-row ${cat.color} shadow-md rounded-lg overflow-hidden border cursor-pointer border-black/20 hover:border-white m-3 items-center transform hover:scale-95 transition-transform`}
                        >
                            <h1 className="p-4 pe-2 text-3xl">{cat.icon}</h1>
                            <div className="p-4">
                                <h4 className="text-xl font-bold">{cat.name}</h4>
                                <h4 className="font-medium">Shops: 4</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

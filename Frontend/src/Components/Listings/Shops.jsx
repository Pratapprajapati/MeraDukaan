
const shops = [
    { id: 1, name: "Shop 1", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Shop 2", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Shop 3", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Shop 4", image: "https://via.placeholder.com/150" },
    { id: 5, name: "Shop 5", image: "https://via.placeholder.com/150" },
    { id: 6, name: "Shop 6", image: "https://via.placeholder.com/150" },
];

export default function Shops() {
    return (
        <section className="container mx-auto mt-8">
            <div className="flex justify-between">
                <h3 className="text-3xl font-bold text-gray-100 mb-4">
                    Shops near you
                    <span className="text-gray-400 text-base ms-2">(Shops registered with MeraDukaan are only displayed here)</span>
                </h3>
                <select className="flex items-center text-lg rounded-lg font-medium cursor-pointer bg-gray-800 text-white py-2 mb-2 px-4 border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transform hover:scale-105 transition-transform">
                    <option value="near">Nearest to me</option>
                    <option value="fav">Favourites</option>
                    <option value="all">All Shops</option>
                </select>

            </div>
            <div className="grid grid-cols-3 pb-4">
                {shops.map((shop) => (
                    <div
                        key={shop.id}
                        className="min-w-[400px] h-[320px] m-3 bg-black/20 text-gray-900 shadow-md rounded-lg overflow-hidden hover:border hover:border-gray-400"
                    >
                        <img src={shop.image} alt={shop.name} className="w-full h-60 object-cover hover:border-gray-900 hover:border hover:rounded-lg" />
                        <div className="p-4">
                            <div className="flex justify-between">
                                <h4 className="text-lg font-bold text-white">{shop.name}</h4>
                                <h4 className="text-white">4.5⭐</h4>
                            </div>
                            <h4 className="text-gray-400">Shop Address</h4>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
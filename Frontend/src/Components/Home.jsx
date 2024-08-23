import React from "react";

const Home = () => {
  return (
    <main className="container mx-auto mt-8">
      <section className="text-center">
        <h2 className="text-4xl font-bold text-teal-500">Welcome to MeraDukaan!</h2>
        <p className="mt-4 text-lg text-gray-300">
          Your one-stop shop for all your needs.
        </p>
      </section>

      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-black/20 text-gray-900 shadow-md rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/150"
            alt="Product 1"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold text-white">Product 1</h3>
            <p className="text-white mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <button className="mt-4 px-4 py-2 bg-teal-500 text-gray-900 rounded">
              Buy Now
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-black/20 text-gray-900 shadow-md rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/150"
            alt="Product 2"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold text-white">Product 2</h3>
            <p className="text-white mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <button className="mt-4 px-4 py-2 bg-teal-500 text-gray-900 rounded">
              Buy Now
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-black/20 text-gray-900 shadow-md rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/150"
            alt="Product 3"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold text-white">Product 3</h3>
            <p className="text-white mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <button className="mt-4 px-4 py-2 bg-teal-500 text-gray-900 rounded">
              Buy Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

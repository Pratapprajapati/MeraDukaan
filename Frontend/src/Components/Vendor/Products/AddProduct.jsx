import { useState } from 'react'
import Toggle from 'react-toggle'
import "react-toggle/style.css";

export default function AddProduct() {

    const [stock, setStock] = useState(true)

    return (
        <section className="overflow-hidden">
            <div className="mx-auto max-w-5xl px-5 sm:py-32">
                <div className="mx-auto flex flex-wrap flex-row max-sm:flex-col items-center lg:w-4/5">
                    <img
                        alt="Nike Air Max 21A"
                        className="h-full max-h:96 w-full max-w-96 mx-auto rounded object-cover lg:h-96 lg:w-1/2"
                        src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
                    />
                    <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:pl-10">
                        <h1 className="my-4 text-3xl font-semibold text-yellow-500">Nike Air Max 21A</h1>
                        <div className="flex flex-col space-y-3">
                            <span className=" inline-block text-sm text-gray-300">
                                Category: <span className='font-semibold text-base'>Food and stuff</span>
                            </span>
                            <span className=" inline-block text-sm text-gray-300">
                                Sub-category: <span className='font-semibold text-base'>Food and stuff</span>
                            </span>
                            <label className="block text-sm font-medium text-gray-400">Item Description:</label>
                            <textarea
                                rows={3}
                                className="mt-1 w-full text-lg px-2 py-1 text-gray-200 bg-transparent border border-gray-700 rounded-lg resize-none"
                                // value={note}
                                // onChange={e => setNote(e.target.value)}
                                placeholder='Ex: Leave at the door'
                            />
                        </div>

                        <div className="my-5 flex items-center border-b-2 border-gray-100 pb-5">
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
                                    checked={stock}
                                    onChange={() => setStock(stock => !stock)}
                                    className="align-middle"
                                />
                                <span className="ml-2 text-sm text-gray-300">
                                    {stock ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>
                        </div>
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
    )
}

import { useState, useEffect } from 'react'
import Toggle from 'react-toggle'
import "react-toggle/style.css";
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import Loading from '../AppPages/Loading';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AddProduct() {

    const location = useLocation()
    const product = location.state
    const [formData, setFormData] = useState({
        stock: true,
        price: product.price,
        description: ""
    })

    const vendor = useOutletContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        vendor.userType != "vendor" ? navigate(-1) : null
        setLoading(false)
    })

    const addToInventory = () => {

        let final = {product: product._id}
        if (formData.price !== product.price) final["price"] = formData.price
        if (formData.stock !== true) final["stock"] = formData.stock
        if (formData.description && formData.description.trim()) final["description"] = formData.description;
        
        axios.post(`/api/inventory/add`, final)
            .then(res => {
                Swal.fire({
                    title: "Product successfully added to your inventory",
                    timer: 1200,
                    icon: 'success',
                    background: '#1a1a2e',
                    width: '400px',
                    heightAuto: false,
                    color: "white"
                });
                navigate(-1)
            })
            .catch(e => console.error(e.response.data.message));
    }

    if (loading) return <Loading />;

    return (
        <section className="overflow-hidden">
            <div className="mx-auto max-w-5xl px-5 sm:py-32">
                <div className="mx-auto flex flex-wrap flex-row max-sm:flex-col items-center lg:w-4/5">
                    <img
                        alt="Nike Air Max 21A"
                        className="h-full max-h:96 w-full max-w-96 mx-auto rounded object-cover lg:h-96 lg:w-1/2"
                        src={product.image}
                    />
                    <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:pl-10">
                        <h1 className="my-4 text-3xl font-semibold text-yellow-500">{product.name}</h1>
                        <div className="flex flex-col space-y-3">
                            <span className=" inline-block text-sm text-gray-300">
                                Category: <span className='font-semibold text-base'>{product.category}</span>
                            </span>
                            <span className=" inline-block text-sm text-gray-300">
                                Sub-category: <span className='font-semibold text-base'>{product.subCategory}</span>
                            </span>
                            <label className="block text-sm font-medium text-gray-400">Item Description:</label>
                            <textarea
                                rows={3}
                                className="mt-1 w-full text-lg px-2 py-1 text-gray-200 bg-transparent border border-gray-700 rounded-lg resize-none"
                                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder='Ex: Brand Name, Ingredients Details, Pack Quantity, etc'
                            />
                        </div>

                        <div className="my-5 flex items-center border-b-2 border-gray-100 pb-5">
                            <div className='w-[50%]'>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Price:</label>
                                <span className="title-font text-xl font-bold text-gray-300">
                                    ₹<input type="number"
                                        value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className='w-24 ml-1 bg-transparent border border-gray-950/50 rounded-md px-1 focus:outline-none focus:border-b focus:border-b-white focus:rounded-none'
                                    />
                                </span>
                            </div>
                            <div className='w-[50%]'>
                                <label className="block text-sm mb-3 font-medium text-gray-400">Product in Stock:</label>
                                <Toggle
                                    id="stock"
                                    name="stock"
                                    checked={formData.stock}
                                    onChange={() => setFormData({ ...formData, stock: !formData.stock })}
                                    className="align-middle"
                                />
                                <span className="ml-2 text-sm text-gray-300">
                                    {formData.stock ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>
                        </div>
                        <div className="w-full">
                            <button
                                type="button" onClick={addToInventory}
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

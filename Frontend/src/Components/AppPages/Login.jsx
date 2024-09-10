import React, { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"

export default function SignIn() {
    const [userType, setUserType] = useState('customer')
    const [formData, setFormData] = useState({ username: "", email: "", password: "" })

    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("");

    // If user logged in then redirect to home page
    useEffect(() => {
        const user = Cookies.get("user") ? true : false

        if (user) navigate(-1)
    }, [])

    const handleInput = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value, username: formData.email }))
        setErrorMessage("")
    }

    const handleForm = (e) => {
        e.preventDefault()
        setFormData({ ...formData, username: formData.email })

        if (userType === "vendor") {
            axios.post("/api/vendor/login", formData)
                .then(res => {

                    navigate("/vendor")
                })
                .catch(e => setErrorMessage(e.response.data.message))
        }
    }


    return (
        <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
                <div className="relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24 max-lg:hidden">
                    <div className="absolute inset-0">
                        <img
                            className="h-full w-full rounded-md object-cover object-top"
                            src="https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTk0fHxkZXNpZ25lcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                            alt=""
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="relative">
                        <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
                            <h3 className="text-4xl font-bold text-white">
                                Now you dont have to rely on your designer to create a new page
                            </h3>
                            <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                                <li className="flex items-center space-x-3">
                                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                        <svg
                                            className="h-3.5 w-3.5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-white"> Commercial License </span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                        <svg
                                            className="h-3.5 w-3.5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-white"> Unlimited Exports </span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                        <svg
                                            className="h-3.5 w-3.5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-white"> 120+ Coded Blocks </span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                        <svg
                                            className="h-3.5 w-3.5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-white"> Design Files Included </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Right side content with modifications */}
                <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                    <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                        <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">Sign in</h2>
                        {/* User type toggle buttons */}
                        <div className="mt-6 font-semibold flex space-x-4 bg-gray-200 p-1 rounded-md">
                            <button
                                onClick={() => setUserType('customer')}
                                className={`flex-1 py-2 px-4 rounded-md transition-colors duration-300 ${userType === 'customer'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Customer
                            </button>
                            <button
                                onClick={() => setUserType('vendor')}
                                className={`flex-1 py-2 px-4 rounded-md transition-colors duration-300 ${userType === 'vendor'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Vendor
                            </button>
                        </div>
                        <form onSubmit={e => handleForm(e)} className="mt-8">
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="text-base font-medium text-gray-300">
                                        Email address or your username
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            id="email" name="email" required placeholder="Email or username"
                                            value={formData.email}
                                            onChange={(e) => handleInput(e)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-base font-medium text-gray-300">
                                            Password
                                        </label>
                                        <a href="#" className="text-sm font-semibold text-gray-400 hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="password" id="password" name="password" required placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => handleInput(e)}
                                        />
                                    </div>
                                </div>
                                {errorMessage && (
                                    <div className="mb-2 p-3 bg-red-100 border font-semibold border-red-400 text-red-700 rounded">
                                        {errorMessage}
                                    </div>
                                )}
                                <div>
                                    <button
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                    >
                                        Get started <ArrowRight className="ml-2" size={16} />
                                    </button>
                                </div>
                                <span className="mt-2 text-gray-300 flex justify-center text-sm">
                                    Don't have an account? &nbsp;

                                    {userType === 'customer' && (
                                        <Link
                                            to={""}
                                            className="font-semibold text-teal-500 transition-all duration-200 hover:underline"
                                        >
                                            Create a free account as Customer
                                        </Link>
                                    )}
                                    {userType === 'vendor' && (
                                        <Link
                                            to={"/register/vendor"}
                                            className="font-semibold text-teal-500 transition-all duration-200 hover:underline"
                                        >
                                            Register your shop as a vendor
                                        </Link>
                                    )}
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import logo from "../assets/logo.png";
import PasswordStrengthIndicator from './PasswordChecker';
import axios from "axios"
import Swal from 'sweetalert2';

export default function CustomerRegister() {
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        age: "",
        password: "",
        confirmPassword: "",
        address: "",
        area: "",
        city: "",
        pincode: "",
        primary: "",
        secondary: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);

    // If user logged in then redirect to home page
    useEffect(() => {
        const user = Cookies.get("user") ? true : false
        if (user) navigate(-1)
    }, [])

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            password: value
        }));
        setPasswordMatch(value === formData.confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            confirmPassword: value
        }));
        setPasswordMatch(value === formData.password);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        axios.post(`/api/customer/register`, formData)
            .then(res => {
                Swal.fire({
                    title: 'Registration Successful!',
                    text: 'Start exploring nearby shops or discover products that match your needs!',
                    icon: 'success',
                    confirmButtonText: 'Let\'s Go!'
                });
                
                navigate("/")
            })
            .catch(e => setErrorMessage(e.response.data.message));
    }

    const inputStyle = "shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline";
    const labelStyle = "block text-sm font-medium text-gray-300 mb-1";

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-zinc-900 shadow-xl shadow-black/70 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <img src={logo} alt="MeraDukaan Logo" className="logo h-24" />
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-semibold text-center text-yellow-300">Join MeraDukaan!</h1>
                            <p className='flex justify-center mt-2 -mb-2 font-semibold'>Already have an account? &nbsp;
                                <Link className='text-teal-500' to={"/signin"}>
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                        <div className="flex w-full max-sm:flex-col gap-4 mb-4">
                            <div className='md:w-2/5'>
                                <label htmlFor="username" className={labelStyle}>Full Name</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInput}
                                    placeholder="Full Name"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div className='md:w-2/5'>
                                <label htmlFor="email" className={labelStyle}>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInput}
                                    placeholder="Email Address"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div className='md:w-1/5'>
                                <label htmlFor="age" className={labelStyle}>Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInput}
                                    placeholder="Age"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Primary and Secondary Contact Numbers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="primary" className={labelStyle}>Primary Contact Number</label>
                                <input
                                    type="number"
                                    id="primary"
                                    name="primary"
                                    value={formData.primary}
                                    onChange={handleInput}
                                    placeholder="Primary Contact"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label htmlFor="secondary" className={labelStyle}>Secondary Contact Number</label>
                                <input
                                    type="number"
                                    id="secondary"
                                    name="secondary"
                                    value={formData.secondary}
                                    onChange={handleInput}
                                    placeholder="Secondary Contact (Optional)"
                                    className={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Password and Confirm Password Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className={labelStyle}>Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handlePasswordChange}
                                        className={inputStyle}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-0 top-0 mt-2 mr-2 text-gray-600"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {formData.password && (
                                    <PasswordStrengthIndicator password={formData.password} />
                                )}
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className={labelStyle}>Confirm Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirm-password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className={inputStyle}
                                    placeholder="Re-enter your password"
                                    required
                                />
                                {formData.confirmPassword && (
                                    <p className={`text-sm mt-2 ${passwordMatch ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Fields */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Address Details</h2>
                        <div className="mb-4">
                            <label htmlFor="address" className={labelStyle}>Address</label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInput}
                                placeholder="Full Address"
                                required
                                className={`${inputStyle} resize-none`}
                                rows="3"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="area" className={labelStyle}>Area</label>
                                <input
                                    type="text"
                                    id="area"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleInput}
                                    placeholder="Area"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label htmlFor="city" className={labelStyle}>City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInput}
                                    placeholder="City"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label htmlFor="pincode" className={labelStyle}>Pincode</label>
                                <input
                                    type="number"
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInput}
                                    placeholder="Pincode"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-black font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
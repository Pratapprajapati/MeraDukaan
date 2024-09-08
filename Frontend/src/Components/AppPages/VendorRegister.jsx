import { useState } from 'react';
import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import Toggle from 'react-toggle'
import "react-toggle/style.css";

export default function VendorRegister() {
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        shopName: "",
        shopType: "General",
        registrationNumber: "",
        address: "",
        city: "",
        pincode: "",
        primary: "",
        secondary: "",
        shopOpen: "",
        shopTimingsStart: "",
        shopTimingsEnd: "",
        returnPol: "",
        delivery: true,
        onlinePayments: false,
    });
    const [shopImageFile, setShopImageFile] = useState(null);
    const [qrCodeImageFile, setQrCodeImageFile] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(false);

    const navigate = useNavigate();


    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            password: value
        }));
        evaluatePasswordStrength(value);
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

    const evaluatePasswordStrength = (password) => {
        let strength = '';
        if (password.length > 8) {
            strength = 'Weak';
            if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
                strength = 'Strong';
            } else if ((/[A-Z]/.test(password) && /[0-9]/.test(password)) || /[A-Z]/.test(password) && /[!@#$%^&*]/.test(password)) {
                strength = 'Medium';
            }
        }
        setPasswordStrength(strength);
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

    const handleToggleChange = (name) => (e) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: e.target.checked
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData, shopImageFile, qrCodeImageFile);        // Implement form submission logic here
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
                            <h1 className="text-3xl sm:text-4xl font-semibold text-center text-yellow-300">Register your shop on MeraDukaan!</h1>
                            <p className='flex justify-center mt-2 -mb-2 font-semibold'>Already have an account? &nbsp;
                                <Link className='text-teal-500' to={"/signin"}>
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 tracking-wider">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Personal Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="mb-2">
                                <label htmlFor="username" className={labelStyle}>Owner's Name</label>
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
                            <div className="mb-2">
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
                            <div className="mb-4">
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
                                    <p className={`text-sm mt-2 ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                        Password Strength: {passwordStrength}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confirm-password" className={labelStyle}>Confirm Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirm-password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className={inputStyle}
                                    placeholder="Re-enter your password"
                                />
                                {formData.confirmPassword && (
                                    <p className={`text-sm mt-2 ${passwordMatch ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Shop Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="mb-2">
                                <label htmlFor="shopName" className={labelStyle}>Shop Name</label>
                                <input
                                    type="text"
                                    id="shopName"
                                    name="shopName"
                                    value={formData.shopName}
                                    onChange={handleInput}
                                    placeholder="Shop Name"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="shopType" className={labelStyle}>Shop Type</label>
                                <select
                                    id="shopType"
                                    name="shopType"
                                    value={formData.shopType}
                                    onChange={handleInput}
                                    required
                                    className={inputStyle}
                                >
                                    <option value="General">General</option>
                                    <option value="Grocery">Grocery</option>
                                    <option value="Stationary">Stationary</option>
                                    <option value="Pharmacy">Pharmacy</option>
                                    <option value="Electronics">Electronics and Hardware</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="registrationNumber" className={labelStyle}>Registration Number</label>
                                <input
                                    type="text"
                                    id="registrationNumber"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleInput}
                                    placeholder="Registration Number"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div className="col-span-full mb-2">
                                <label htmlFor="address" className={labelStyle}>Address</label>
                                <textarea
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInput}
                                    placeholder="Full Address"
                                    required
                                    className={`${inputStyle} resize-none`}
                                />
                            </div>
                            <div className="mb-2">
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
                            <div className="mb-2">
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
                            <div className="mb-2">
                                <label htmlFor="shopImage" className={labelStyle}>Shop Image</label>
                                <input
                                    type="file"
                                    id="shopImage"
                                    onChange={(e) => setShopImageFile(e.target.files[0])}
                                    required
                                    className={`${inputStyle} py-1.5 text-gray-300`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Contact & Operations</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="mb-2">
                                <label htmlFor="primary" className={labelStyle}>Primary Contact</label>
                                <input
                                    type="number"
                                    id="primary"
                                    name="primary"
                                    value={formData.primary}
                                    onChange={handleInput}
                                    placeholder="Primary Phone"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="secondary" className={labelStyle}>Secondary Contact</label>
                                <input
                                    type="number"
                                    id="secondary"
                                    name="secondary"
                                    value={formData.secondary}
                                    onChange={handleInput}
                                    placeholder="Secondary Phone (Optional)"
                                    className={inputStyle}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="shopOpen" className={labelStyle}>Shop Open Days</label>
                                <input
                                    type="text"
                                    id="shopOpen"
                                    name="shopOpen"
                                    value={formData.shopOpen}
                                    onChange={handleInput}
                                    placeholder="e.g. Everyday, Mon-Fri"
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="shopTimingsStart" className={labelStyle}>Shop Start Time</label>
                                <input
                                    type="time"
                                    id="shopTimingsStart"
                                    name="shopTimingsStart"
                                    value={formData.shopTimingsStart}
                                    onChange={handleInput}
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="shopTimingsEnd" className={labelStyle}>Shop End Time</label>
                                <input
                                    type="time"
                                    id="shopTimingsEnd"
                                    name="shopTimingsEnd"
                                    value={formData.shopTimingsEnd}
                                    onChange={handleInput}
                                    required
                                    className={inputStyle}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="returnPol" className={labelStyle}>Return Policy</label>
                                <input
                                    type="text"
                                    id="returnPol"
                                    name="returnPol"
                                    value={formData.returnPol}
                                    onChange={handleInput}
                                    placeholder="e.g. Return, No Return"
                                    className={inputStyle}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="delivery" className={labelStyle}>Delivery Available</label>
                                <div className='mt-3'>
                                    <Toggle
                                        id="delivery"
                                        name="delivery"
                                        checked={formData.delivery}
                                        onChange={handleToggleChange('delivery')}
                                        className="align-middle"
                                    />
                                    <span className="ml-2 text-sm text-gray-300">
                                        {formData.delivery ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-2">
                                <label htmlFor="onlinePayments" className={labelStyle}>Online Payments Accepted?</label>
                                <div className='mt-3'>
                                    <Toggle
                                        id="onlinePayments"
                                        name="onlinePayments"
                                        checked={formData.onlinePayments}
                                        onChange={handleToggleChange('onlinePayments')}
                                        className="align-middle"
                                    />
                                    <span className="ml-2 text-sm text-gray-300">
                                        {formData.onlinePayments ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>

                            {formData.onlinePayments && (
                                <div className="-mb-1">
                                    <label htmlFor="qrCodeImage" className={labelStyle}>QR Code Image</label>
                                    <input
                                        type="file"
                                        id="qrCodeImage"
                                        onChange={(e) => setQrCodeImageFile(e.target.files[0])}
                                        className={`${inputStyle} py-1.5 text-gray-300`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mb-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-black font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
                    >
                        Register Shop
                    </button>
                    <p className="text-center text-gray-300 mt-2 -mb-1">
                        * Your details will be submitted for verification.
                        Your shop will be registered on MeraDukaan once the verification process is complete.
                        You will be notified shortly.
                    </p>

                </form>
            </div>
        </div>
    );
}
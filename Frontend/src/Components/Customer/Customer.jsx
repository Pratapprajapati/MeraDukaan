import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Customer() {
    const [details, setDetails] = useState({
        username: "johndoe",
        email: "johndoe@example.com",
        contact: {
            primary: "1234567890",
            secondary: "0987654321",
        },
        location: {
            address: "123 Main St",
            area: "Downtown",
            city: "New York",
            pincode: "10001",
        },
    });

    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
            <div className="bg-black/10 text-gray-900 p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl sm:text-2xl font-bold text-teal-500 mb-4 sm:mb-6">Personal Details</h2>
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                        <div className="w-full sm:w-1/2">
                            <InputField
                                label="Username"
                                value={details.username}
                                disabled={true}
                            />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <InputField
                                label="Email"
                                value={details.email}
                                onChange={(value) => setDetails({ ...details, email: value })}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-600 my-4" />

                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                        <div className="w-full sm:w-1/2">
                            <InputField
                                label="Primary Contact"
                                value={details.contact.primary}
                                onChange={(value) => setDetails({ ...details, contact: { ...details.contact, primary: value } })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <InputField
                                label="Secondary Contact"
                                value={details.contact.secondary}
                                onChange={(value) => setDetails({ ...details, contact: { ...details.contact, secondary: value } })}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-600 my-4" />

                    <div>
                        <InputField
                            label="Address"
                            value={details.location.address}
                            onChange={(value) => setDetails({ ...details, location: { ...details.location, address: value } })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                        <div className="w-full sm:w-1/3">
                            <InputField
                                label="Area"
                                value={details.location.area}
                                onChange={(value) => setDetails({ ...details, location: { ...details.location, area: value } })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="w-full sm:w-1/3">
                            <InputField
                                label="City"
                                value={details.location.city}
                                onChange={(value) => setDetails({ ...details, location: { ...details.location, city: value } })}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="w-full sm:w-1/3">
                            <InputField
                                label="Pincode"
                                value={details.location.pincode}
                                onChange={(value) => setDetails({ ...details, location: { ...details.location, pincode: value } })}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <>
                            <hr className="border-gray-600 my-4" />
                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                                <div className="w-full sm:w-1/2">
                                    <InputField
                                        label="New Password"
                                        type="password"
                                        value={details.newPassword || ''}
                                        onChange={(value) => setDetails({ ...details, newPassword: value })}
                                    />
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <InputField
                                        label="Old Password"
                                        type="password"
                                        value={details.oldPassword || ''}
                                        onChange={(value) => setDetails({ ...details, oldPassword: value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <hr className="border-gray-600 my-6" />

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <button 
                        className="w-full sm:w-auto px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition duration-300" 
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                    <button
                        className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                        onClick={() => {/* Add your cart navigation logic here */}}
                    >
                        <ShoppingCart className="mr-2" /> Go to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

const InputField = ({ label, value, onChange, disabled = false, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            className={`w-full py-1 text-gray-200 bg-transparent ${disabled ? '' : 'border-b border-gray-600'} focus:outline-none focus:border-teal-500`}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            disabled={disabled}
        />
    </div>
);
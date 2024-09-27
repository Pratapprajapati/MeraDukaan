import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Truck, RefreshCw, Eye, EyeOff, Edit, Save, ShoppingCart, Package } from 'lucide-react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';
import { convertToAmPm } from '../utility';
import Swal from 'sweetalert2';

const Alert = (message) => {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        background: '#1a1a2e',
        color: 'white',
        text: message,
        timer: 1000,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
    });
};


export default function ShopDetailsPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [vendorDetails, setVendorDetails] = useState(null);
    const [originalDetails, setOriginalDetails] = useState(null);

    const [passwordFields, setPasswordFields] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const params = useParams()
    const user = useOutletContext();
    const vendor = user.userType == "vendor" ? user._id : params.vendorId
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/vendor/current/${vendor}`)
            .then(res => {
                setVendorDetails(res.data.data);
                setOriginalDetails(JSON.parse(JSON.stringify(res.data.data)));
                setLoading(false);
            })
            .catch(e => {
                console.error(e.response.data.message);
                setLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        setVendorDetails(prevState => {
            const updatedVendorDetails = { ...prevState };
            let current = updatedVendorDetails;
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    current[key] = value;
                } else {
                    current = current[key] = current[key] || {};
                }
            });
            return updatedVendorDetails;
        });
    };

    const handlePasswordChange = (e) => {
        setErrorMessage("")
        const { name, value } = e.target
        setPasswordFields({ ...passwordFields, [name]: value })
    }

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const toggleEdit = () => {
        if (isEditing) {
            const formData = {};
            const addChangedFields = (obj1, obj2, prefix = '') => {
                Object.keys(obj1).forEach(key => {
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    if (typeof obj1[key] === 'object' && obj1[key] !== null) {
                        addChangedFields(obj1[key], obj2[key], fullKey);
                    } else if (obj1[key] !== obj2[key]) {
                        formData[fullKey] = obj1[key];
                    }
                });
            };
            // console.log('Changed fields:', formData);

            addChangedFields(vendorDetails, originalDetails);

            if (Object.keys(formData).length > 0) {
                setLoading(true)
                axios.patch(`/api/vendor/update/details`, formData)
                    .then(res => {
                        const data = res.data
                        setOriginalDetails(data.data);
                        Alert(data.message)
                        setLoading(false)
                        setIsEditing(!isEditing);
                    })
                    .catch(e => console.error(e.response.data.message));
            }

            const { oldPassword, newPassword, confirmPassword } = passwordFields
            if (oldPassword && newPassword && confirmPassword) {
                if (newPassword !== confirmPassword) {
                    alert('Passwords do not match');
                    return;
                } else {
                    axios.patch(`/api/vendor/update/password`, { oldPassword, newPassword })
                        .then(res => {
                            const data = res.data.message;
                            Alert(data)
                            setIsEditing(!isEditing);
                            setPasswordFields({
                                oldPassword: "",
                                newPassword: "",
                                confirmPassword: ""
                            })
                        })
                        .catch(e => setErrorMessage(e.response.data.message));
                }
            }
        }

        else setIsEditing(!isEditing);
    };


    if (loading || !vendorDetails) return <Loading />;

    const inputStyle = "bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded w-fit";
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-black/20 shadow-2xl shadow-black/60 rounded-lg border border-black/20 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-2/5 p-4">
                        <img
                            className="w-full h-64 rounded-md object-cover"
                            src={vendorDetails.shopImage}
                            alt={vendorDetails.shopName}
                        />
                    </div>
                    <div className="lg:w-3/5 p-6">
                        <div className="flex flex-row justify-between items-center mb-4">
                            <div className="w-full sm:w-auto mb-2 sm:mb-0">
                                <span className="bg-gray-700 text-white px-4 py-2 rounded-full text-md font-semibold">
                                    {vendorDetails.shopType}
                                </span>
                            </div>
                            <button
                                className={`px-3 py-1 rounded ${vendorDetails.isOpen ? 'bg-green-600' : 'bg-red-600'} text-white`}
                                onClick={() => vendor.userType === "vendor" && setVendorDetails(prev => ({ ...prev, isOpen: !prev.isOpen }))}
                                disabled={vendor.userType === "customer"}
                            >
                                {vendorDetails.isOpen ? "OPEN" : "CLOSED"}
                            </button>
                        </div>
                        <h1 className="text-3xl font-bold text-yellow-400 mb-4">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="shopName"
                                    value={vendorDetails.shopName}
                                    onChange={handleInputChange}
                                    className="bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded w-full"
                                />
                            ) : (
                                vendorDetails.shopName
                            )}
                        </h1>
                        <div className="text-gray-300 mb-4 flex">
                            <MapPin className="inline-block mr-2" />
                            {isEditing ? (
                                <div className="space-y-2">
                                    <textarea rows={2}
                                        type="text"
                                        name="location.address"
                                        value={vendorDetails.location.address}
                                        onChange={handleInputChange}
                                        className="bg-gray-700 border resize-none border-gray-500 text-white py-1 px-2 rounded w-full"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        <input
                                            type="text"
                                            name="location.area"
                                            value={vendorDetails.location.area}
                                            onChange={handleInputChange}
                                            className="bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded flex-grow"
                                            placeholder="Area"
                                        />
                                        <input
                                            type="text"
                                            name="location.city"
                                            value={vendorDetails.location.city}
                                            onChange={handleInputChange}
                                            className="bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded flex-grow"
                                            placeholder="City"
                                        />
                                        <input
                                            type="text"
                                            name="location.pincode"
                                            value={vendorDetails.location.pincode}
                                            onChange={handleInputChange}
                                            className="bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded w-full sm:w-24"
                                            placeholder="Pincode"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col'>
                                    <p>{vendorDetails.location.address}</p>
                                    <p>{vendorDetails.location.area}, {vendorDetails.location.city} - {vendorDetails.location.pincode}</p>
                                </div>
                            )}
                        </div>
                        {/* New section for customer/vendor toggle */}
                        {user.userType === "customer" ? (
                            <div className="py-4 flex max-md:flex-col justify-between md:space-x-4 max-md:space-y-3 border-t border-t-gray-700 mt-3">
                                <button
                                    onClick={() => navigate("/order/place")}
                                    className="flex items-center w-full bg-yellow-500 hover:bg-yellow-500 text-black font-bold py-4 px-4 rounded"
                                >
                                    <ShoppingCart className="mr-2" /> Cart Items of this Vendor
                                </button>
                                <button
                                    onClick={() => navigate("storefront", {state: originalDetails})}
                                    className="flex items-center w-full bg-teal-500 hover:bg-teal-600 text-black font-bold py-4 px-4 rounded"
                                >
                                    <Package className="mr-2" /> View Products
                                </button>
                            </div>
                        ) : (
                            <div className="py-4 flex max-sm:flex-col justify-between max-sm:space-y-3 border-t border-t-gray-700 mt-3 -mb-3 ">
                                <button
                                    onClick={toggleEdit}
                                    className="flex items-center bg-teal-500 hover:bg-teal-600 text-black font-bold py-2 px-4 rounded"
                                >
                                    {isEditing ? <><Save className="mr-2" /> Save</> : <><Edit className="mr-2" /> Edit</>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Email, Password, Confirm Password Section */}
                {isEditing && (
                    <div className="p-6 border-t border-t-gray-700 -mt-2">
                        <div className="mb-6">
                            <h2 className="text-lg font-medium text-gray-200 mb-4">Account Details</h2>
                            <div className="flex flex-col md:flex-row md:space-x-4">
                                {/* Email Field */}
                                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={vendorDetails.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="bg-gray-700 border border-gray-500 text-white py-2 px-4 rounded w-full"
                                    />
                                </div>

                                {/* Old Password Field */}
                                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Old Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword.oldPassword ? "text" : "password"}
                                            name="oldPassword"
                                            value={passwordFields.oldPassword}
                                            onChange={handlePasswordChange}
                                            className="bg-gray-700 border border-gray-500 text-white py-2 px-4 rounded w-full pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('oldPassword')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
                                        >
                                            {showPassword.oldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password Field */}
                                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword.newPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={passwordFields.newPassword}
                                            onChange={handlePasswordChange}
                                            className="bg-gray-700 border border-gray-500 text-white py-2 px-4 rounded w-full pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('newPassword')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
                                        >
                                            {showPassword.newPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="w-full md:w-1/3">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword.confirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={passwordFields.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="bg-gray-700 border border-gray-500 text-white py-2 px-4 rounded w-full pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
                                        >
                                            {showPassword.confirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="mb-2 p-3 bg-red-100 border font-semibold border-red-400 text-red-700 rounded">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                )}

                {/* Contact section */}
                <div className="border-t border-gray-700 px-4 py-5">
                    <dl className="divide-y divide-gray-700">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-lg font-medium text-gray-200 flex items-center">
                                <Phone className="h-5 w-5 mr-2" />
                                Contact
                            </dt>
                            <dd className="mt-1 text-lg text-gray-300 sm:mt-0 sm:col-span-2 space-y-2">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="number"
                                            name="contact.primary"
                                            value={vendorDetails.contact.primary}
                                            onChange={handleInputChange}
                                            className={`ms-2 ${inputStyle}`}
                                        />
                                        {vendorDetails.contact.secondary && (
                                            <>
                                                <input
                                                    type="number"
                                                    name="contact.secondary"
                                                    value={vendorDetails.contact.secondary}
                                                    onChange={handleInputChange}
                                                    className={`ms-2 ${inputStyle}`}
                                                />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <span>{vendorDetails.contact.primary}{vendorDetails.contact.secondary && ` / ${vendorDetails.contact.secondary}`}</span>
                                )}
                            </dd>
                        </div>

                        {/* Shop Open hours and days */}
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-lg font-medium text-gray-200 flex items-center">
                                <Clock className="h-5 w-5 mr-2" />
                                Hours
                            </dt>
                            <dd className="mt-1 text-lg text-gray-300 sm:col-span-2 flex gap-4 items-center">
                                {isEditing ? (
                                    <div className='flex max-lg:flex-col space-y-2'>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="time"
                                                name="shopTimings.start"
                                                value={vendorDetails.shopTimings.start}
                                                onChange={handleInputChange}
                                                className={inputStyle}
                                            />
                                            {' - '}
                                            <input
                                                type="time"
                                                name="shopTimings.end"
                                                value={vendorDetails.shopTimings.end}
                                                onChange={handleInputChange}
                                                className={inputStyle}
                                            />
                                        </div>
                                        <div className="flex items-center lg:mx-2">
                                            <label className="text-gray-200">Open:</label>
                                            <input
                                                type="text"
                                                name="shopOpen"
                                                value={vendorDetails.shopOpen}
                                                onChange={handleInputChange}
                                                className={inputStyle}
                                                placeholder="Open/Closed"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span>
                                        {convertToAmPm(vendorDetails.shopTimings.start)} -
                                        {convertToAmPm(vendorDetails.shopTimings.end)}
                                        {' / '}
                                        {vendorDetails.shopOpen}
                                    </span>

                                )}
                            </dd>
                        </div>

                        {/* Delivery */}
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-lg font-medium text-gray-200 flex items-center">
                                <Truck className="h-5 w-5 mr-2" />
                                Delivery
                            </dt>
                            <dd className="mt-1 text-lg text-gray-300 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <select
                                        name="delivery"
                                        value={vendorDetails.delivery ? 'Available' : 'Not available'}
                                        onChange={(e) => handleInputChange({
                                            target: {
                                                name: 'delivery',
                                                value: e.target.value === 'Available'
                                            }
                                        })}
                                        className="bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded"
                                    >
                                        <option>Available</option>
                                        <option>Not available</option>
                                    </select>
                                ) : (
                                    <span>{vendorDetails.delivery ? 'Available' : 'Not available'}</span>
                                )}
                            </dd>
                        </div>

                        {/* Return Policy */}
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-lg font-medium text-gray-200 flex items-center">
                                <RefreshCw className="h-5 w-5 mr-2" />
                                Refund/Exchange
                            </dt>
                            <dd className="mt-1 text-lg text-gray-300 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <input
                                        name="refundExchange"
                                        value={vendorDetails.returnPol}
                                        onChange={(e) => handleInputChange({
                                            target: {
                                                name: 'returnPol',
                                                value: e.target.value
                                            }
                                        })}
                                        className="bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded"
                                    />
                                ) : (
                                    <span>{vendorDetails.returnPol}</span>
                                )}
                            </dd>
                        </div>

                        {/* <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-lg font-medium text-gray-200 flex items-center">
                                <Info className="h-5 w-5 mr-2" />
                                Description
                            </dt>
                            <dd className="mt-1 text-lg text-gray-300 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <textarea
                                        name="description"
                                        value={vendorDetails.description}
                                        onChange={handleInputChange}
                                        className="bg-gray-700 border border-gray-500 text-white py-1 px-2 rounded w-full"
                                        rows={3}
                                    />
                                ) : (
                                    <span>{vendorDetails.description}</span>
                                )}
                            </dd>
                        </div> */}
                    </dl>
                </div>

            </div>
        </div>
    );
}
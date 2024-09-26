import { useState, useEffect } from 'react';
import { ArrowLeftCircle, PenBox, Save, ShoppingCart, Eye, EyeOff } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../AppPages/Loading';
import Swal from 'sweetalert2';

const InputField = ({ label, value, onChange, disabled = false, type = "text", isPassword = false, showPassword, togglePasswordVisibility }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <div className="relative">
            <input
                type={isPassword ? (showPassword ? "text" : "password") : type}
                className={`w-full py-1 text-gray-200 bg-transparent ${disabled ? '' : 'border-b border-gray-600'} focus:outline-none focus:border-teal-500 ${isPassword ? 'pr-10' : ''}`}
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                disabled={disabled}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 focus:outline-none"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            )}
        </div>
    </div>
);

const Alert = (message, icon = 'success') => {
    Swal.fire({
        icon: icon,
        title: icon === 'success' ? 'Success' : 'Error',
        background: '#1a1a2e',
        color: 'white',
        text: message,
        timer: 1000,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
    });
};

export default function Customer() {
    const [details, setDetails] = useState({});
    const [originalDetails, setOriginalDetails] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
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

    const customer = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (customer.userType !== "customer") {
            navigate(-1);
            return;
        }

        axios.get(`/api/customer/current`)
            .then(res => {
                const data = res.data.data;
                setDetails(data);
                setOriginalDetails(data);
                setLoading(false);
            })
            .catch(e => {
                console.error(e.response.data.message);
                setLoading(false);
            });
    }, []);

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePasswordChange = (e) => {
        setErrorMessage("");
        const { name, value } = e.target;
        setPasswordFields({ ...passwordFields, [name]: value });
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
            addChangedFields(details, originalDetails);

            if (Object.keys(formData).length > 0) {
                setLoading(true);
                axios.patch(`/api/customer/update`, formData)
                    .then(res => {
                        const data = res.data.data;
                        setOriginalDetails(data);
                        setLoading(false);
                        Alert('Profile updated successfully');
                    })
                    .catch(e => {
                        console.error(e.response.data.message);
                        setLoading(false);
                        Alert('Failed to update profile', 'error');
                    });
            }

            const { oldPassword, newPassword, confirmPassword } = passwordFields;
            if (oldPassword && newPassword && confirmPassword) {
                if (newPassword !== confirmPassword) {
                    setErrorMessage('New passwords do not match');
                    return;
                } else {
                    axios.patch(`/api/customer/password`, { oldPassword, newPassword })
                        .then(res => {
                            Alert('Password changed successfully');
                            setPasswordFields({
                                oldPassword: "",
                                newPassword: "",
                                confirmPassword: ""
                            });
                        })
                        .catch(e => setErrorMessage(e.response.data.message || 'Failed to change password'));
                }
            }
        }
        setIsEditing(!isEditing);
    };

    if (loading) return <Loading />;

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
            <div className="bg-black/30 text-gray-900 p-4 sm:p-6 rounded-lg shadow-md">
                <div className='flex justify-between border-b border-b-gray-600 mb-4'>
                    <h2 className="text-xl sm:text-2xl font-bold text-teal-500 mb-4 sm:mb-6">Personal Details</h2>
                    <ShoppingCart className="m-2 h-7 w-7 cursor-pointer text-yellow-500 inline-flex transform hover:scale-125" onClick={() => navigate("/cart")} />
                </div>
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
                                <div className="w-full sm:w-1/3">
                                    <InputField
                                        label="Old Password"
                                        type="password"
                                        isPassword={true}
                                        value={passwordFields.oldPassword}
                                        onChange={(value) => handlePasswordChange({ target: { name: 'oldPassword', value } })}
                                        showPassword={showPassword.oldPassword}
                                        togglePasswordVisibility={() => togglePasswordVisibility('oldPassword')}
                                    />
                                </div>
                                <div className="w-full sm:w-1/3">
                                    <InputField
                                        label="New Password"
                                        type="password"
                                        isPassword={true}
                                        value={passwordFields.newPassword}
                                        onChange={(value) => handlePasswordChange({ target: { name: 'newPassword', value } })}
                                        showPassword={showPassword.newPassword}
                                        togglePasswordVisibility={() => togglePasswordVisibility('newPassword')}
                                    />
                                </div>
                                <div className="w-full sm:w-1/3">
                                    <InputField
                                        label="Confirm New Password"
                                        type="password"
                                        isPassword={true}
                                        value={passwordFields.confirmPassword}
                                        onChange={(value) => handlePasswordChange({ target: { name: 'confirmPassword', value } })}
                                        showPassword={showPassword.confirmPassword}
                                        togglePasswordVisibility={() => togglePasswordVisibility('confirmPassword')}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {errorMessage && (
                        <div className="mb-2 p-3 bg-red-100 border font-semibold border-red-400 text-red-700 rounded">
                            {errorMessage}
                        </div>
                    )}

                    <hr className="border-gray-600 my-6" />

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row text-black font-semibold justify-between items-center space-y-4 sm:space-y-0">
                        <button
                            className="w-full sm:w-auto px-6 py-2 bg-gray-400 rounded hover:bg-gray-500 transition duration-300 flex items-center justify-center"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeftCircle className="mr-2" />Go Back
                        </button>
                        <button
                            className="w-full sm:w-auto px-4 py-2 bg-teal-500 rounded hover:bg-teal-600 transition duration-300"
                            onClick={toggleEdit}
                        >
                            {isEditing ? (
                                <div><Save className='inline-flex' /> Save Changes</div>
                            ) : (
                                <div><PenBox className='inline-flex' /> Edit Profile</div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
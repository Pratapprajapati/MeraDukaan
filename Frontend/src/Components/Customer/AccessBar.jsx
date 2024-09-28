import { useState, useEffect } from 'react';
import { Menu, ShoppingCart, History, User, LogOut, X, Store, Archive, CalendarClock } from 'lucide-react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import logo from "../assets/logo.png";
import axios from 'axios';
import { decrypt } from "../utility"
import Cookies from "js-cookie"

export default function AccessBar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const signedIn = Cookies.get("user")
    let user = signedIn ? decrypt() : null

    useEffect(() => {
        if (user.userType !== "customer" || user.userStatus !== "active") {
            navigate(-1)
        }
    }, [])
    
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const logout = () => {
        axios.get("/api/customer/logout")
            .then(res => {
                navigate("/signin");
            })
            .catch(e => console.log(e));
    };

    return (
        <div className="flex h-screen">
            {/* AccessBar */}
            <aside
                className={`fixed inset-y-0 right-0 z-30 w-64 transform bg-black overflow-y-auto max-sm:border-l px-5 py-8 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64 lg:bg-black lg:px-5 lg:py-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex items-center justify-end">
                    <button className="text-white lg:hidden" onClick={toggleSidebar}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className="flex flex-col justify-between h-full">
                    <div>
                        <div className="flex justify-center mb-10">
                            <NavLink to={"/"} className={({isActive}) => isActive? "home" : null}>
                                <img src={logo} className="h-24 w-24 logo" alt="Logo" />
                            </NavLink>
                        </div>

                        <nav className="-mx-3 space-y-6 mt-6">
                            {/* Navigation Section */}
                            <div className="space-y-3">
                                <label className="px-3 text-xs font-semibold uppercase text-white">
                                    Navigation
                                </label>
                                <NavLink
                                    to="/shops"
                                    className={({ isActive }) =>
                                        `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-50 text-gray-700' : 'text-gray-200 hover:bg-gray-50 hover:text-gray-700'}`
                                    }
                                >
                                    <Store className="h-5 w-5" aria-hidden="true" />
                                    <span className="mx-2">Nearby Shops</span>
                                </NavLink>
                                <NavLink
                                    to="/products"
                                    className={({ isActive }) =>
                                        `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-50 text-gray-700' : 'text-gray-200 hover:bg-gray-50 hover:text-gray-700'}`
                                    }
                                >
                                    <Archive className="h-5 w-5" aria-hidden="true" />
                                    <span className="mx-2">Products</span>
                                </NavLink>
                            </div>

                            {/* Management Section */}
                            <div className="space-y-3">
                                <label className="px-3 text-xs font-semibold uppercase text-white">
                                    Orders
                                </label>
                                <NavLink
                                    to="/order/recent"
                                    className={({ isActive }) =>
                                        `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-50 text-gray-700' : 'text-gray-200 hover:bg-gray-50 hover:text-gray-700'}`
                                    }
                                >
                                    <History className="h-5 w-5" aria-hidden="true" />
                                    <span className="mx-2">Recent Orders</span>
                                </NavLink>
                                <NavLink
                                    to="/order/history"
                                    className={({ isActive }) =>
                                        `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-50 text-gray-700' : 'text-gray-200 hover:bg-gray-50 hover:text-gray-700'}`
                                    }
                                >
                                    <CalendarClock className="h-5 w-5" aria-hidden="true" />
                                    <span className="mx-2">Order History</span>
                                </NavLink>
                            </div>

                            {/* Account Section */}
                            <div className="space-y-3">
                                <label className="px-3 text-xs font-semibold uppercase text-white">
                                    Account
                                </label>
                                <NavLink
                                    to="/customer"
                                    className={({ isActive }) =>
                                        `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-50 text-gray-700' : 'text-gray-200 hover:bg-gray-50 hover:text-gray-700'}`
                                    }
                                >
                                    <User className="h-5 w-5" aria-hidden="true" />
                                    <span className="mx-2">Your Profile</span>
                                </NavLink>
                                <NavLink
                                    to="/cart"
                                    className={({ isActive }) =>
                                        `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-50 text-gray-700' : 'text-gray-200 hover:bg-gray-50 hover:text-gray-700'}`
                                    }
                                >
                                    <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                                    <span className="mx-2">Cart</span>
                                </NavLink>
                            </div>
                        </nav>
                    </div>

                    <div className="mt-6">
                        <p
                            onClick={logout}
                            className="flex transform cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 text-gray-200 hover:bg-gray-100 hover:text-gray-800"
                        >
                            <LogOut className="h-5 w-5" aria-hidden="true" />
                            <span className="mx-2">Logout</span>
                        </p>
                    </div>
                </div>
            </aside>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header with Toggle Button */}
                <div className="lg:hidden flex justify-between items-center p-4 bg-gray-900 text-white">
                    <h1 className="text-lg font-semibold">My App</h1>
                    <button onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto sm:p-4">
                    <Outlet context={user}/>
                </div>
            </div>
        </div>
    );
}

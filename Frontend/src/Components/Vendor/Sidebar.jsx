import React, { useState } from 'react';
import { Menu, Home, BarChart, History, Archive, PlusCircle, LogOut } from 'lucide-react';
import { Outlet, NavLink } from 'react-router-dom';

export default function SidebarTwo() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-black overflow-y-auto border-r px-5 py-8 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64 lg:static lg:bg-black lg:border-r lg:px-5 lg:py-8 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between">
                    <button className="text-white lg:hidden" onClick={toggleSidebar}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className="mt-6 flex flex-1 flex-col justify-between">
                    <nav className="-mx-3 space-y-6">
                        <div className="space-y-3">
                            <label className="px-3 text-xs font-semibold uppercase text-white">
                                Navigation
                            </label>
                            <NavLink
                                to="/vendor"
                                className={({ isActive }) =>
                                    `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-50 text-gray-700' : 'text-gray-200 hover:bg-gray-50 hover:text-gray-700'
                                    }`
                                }
                            >
                                <Home className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2">Overview</span>
                            </NavLink>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-50 text-gray-700' : 'text-gray-200 hover:bg-gray-50 hover:text-gray-700'
                                    }`
                                }
                            >
                                <BarChart className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2">Dashboard</span>
                            </NavLink>
                            <NavLink
                                to="/order-history"
                                className={({ isActive }) =>
                                    `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-100 text-gray-800' : 'text-gray-200 hover:bg-gray-100 hover:text-gray-800'
                                    }`
                                }
                            >
                                <History className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2">Order History</span>
                            </NavLink>
                        </div>

                        <div className="space-y-3">
                            <label className="px-3 text-xs font-semibold uppercase text-white">
                                Management
                            </label>
                            <NavLink
                                to="/inventory"
                                className={({ isActive }) =>
                                    `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-100 text-gray-800' : 'text-gray-200 hover:bg-gray-100 hover:text-gray-800'
                                    }`
                                }
                            >
                                <Archive className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2">Inventory</span>
                            </NavLink>
                            <NavLink
                                to="/add-products"
                                className={({ isActive }) =>
                                    `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-100 text-gray-800' : 'text-gray-200 hover:bg-gray-100 hover:text-gray-800'
                                    }`
                                }
                            >
                                <PlusCircle className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2">Add Products</span>
                            </NavLink>
                        </div>

                        <div className="space-y-3">
                            <label className="px-3 text-xs font-semibold uppercase text-white">
                                Account
                            </label>
                            <NavLink
                                to="/logout"
                                className={({ isActive }) =>
                                    `flex transform items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-100 text-gray-800' : 'text-gray-200 hover:bg-gray-100 hover:text-gray-800'
                                    }`
                                }
                            >
                                <LogOut className="h-5 w-5" aria-hidden="true" />
                                <span className="mx-2">Logout</span>
                            </NavLink>
                        </div>
                    </nav>
                </div>            </aside>

            {/* Overlay for Mobile */}
            {isOpen && <div className="fixed inset-0 bg-black opacity-50 lg:hidden" onClick={toggleSidebar}></div>}

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${isOpen ? 'lg:ml-64' : ''}`}>
                {/* Mobile Header with Toggle Button */}
                <div className="lg:hidden flex justify-between items-center p-4 bg-gray-900 text-white">
                    <h1 className="text-lg font-semibold">My App</h1>
                    <button onClick={toggleSidebar}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="p-4 overflow-y-scroll h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

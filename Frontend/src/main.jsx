import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom"

// General Pages
import About from './Components/About.jsx'
import Error from './Components/AppPages/ErrorPage.jsx'

// Authentication Pages
import Login from "./Components/AppPages/Login.jsx"
import VendorRegister from "./Components/AppPages/VendorRegister.jsx"
import CustomerRegister from './Components/AppPages/CustomerRegister.jsx'

// Customer Pages
import Home from './Components/Home.jsx'
import Shops from './Components/Customer/ShopPages/Shops.jsx'
import Customer from './Components/Customer/Customer.jsx'
import StoreFront from './Components/Customer/ShopPages/StoreFront.jsx'
import Cart from './Components/Customer/CartList.jsx'

// Vendor Pages
import Vendor from './Components/Vendor/Vendor.jsx'
import Inventory from './Components/Vendor/Inventory.jsx'
import Dashboard from './Components/Vendor/Dashboard.jsx'

// Products Pages
import ProductList from './Components/Products/ProductList.jsx'
import AddProduct from './Components/Products/AddProduct.jsx'
import NewProduct from './Components/Products/NewProduct.jsx'
import ProductShops from './Components/Products/ProductShops.jsx'

// Orders Pages
import PlaceOrder from './Components/Orders/PlaceOrder.jsx'
import OrderDetails from './Components/Orders/OrderDetail.jsx'
import OrdersPage from "./Components/Orders/Overview.jsx"
import OrderHistory from './Components/Orders/OrderHistory.jsx'
import RecentOrders from './Components/Orders/RecentOrders.jsx'
import ViewOrder from './Components/Orders/ViewOrder.jsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index element={<About />} />
            <Route path='/signin' element={<Login />} />
            <Route path='/register/vendor' element={<VendorRegister />} />
            <Route path='/register/customer' element={<CustomerRegister />} />

            {/* Vendor Routes */}
            <Route path='/vendor/overview' element={<OrdersPage />} />
            <Route path='vendor/order/:orderId' element={<OrderDetails />} />
            <Route path='vendor/history' element={<OrderHistory />} />
            <Route path='vendor/dashboard' element={<Dashboard />} />
            <Route path='vendor/inventory' element={<Inventory />} />
            <Route path='vendor/products' element={<ProductList />} />
            <Route path='vendor/products/add' element={<AddProduct />} />
            <Route path='vendor/products/new' element={<NewProduct />} />
            <Route path='/vendor/shop' element={<Vendor />} />

            {/* Customer Routes */}
            <Route path='/home' element={<Home />} />
            <Route path='/shops' element={<Shops />} />
            <Route path='/shops/vendor/:vendorId' element={<Vendor />} />
            <Route path='/shops/vendor/:vendorId/storefront' element={<StoreFront />} />
            <Route path='/products' element={<ProductList />} />
            <Route path='/products/shops' element={<ProductShops />} />
            <Route path='/order/recent' element={<RecentOrders />} />
            <Route path='/order/history' element={<OrderHistory />} />
            <Route path='/order/place' element={<PlaceOrder />} />
            <Route path='/order/details/:orderId' element={<ViewOrder />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/customer' element={<Customer />} />
            
            {/* Fallback Route */}
            <Route path='/*' element={<Error />} />
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)

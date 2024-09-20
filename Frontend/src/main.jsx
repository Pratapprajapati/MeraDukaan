import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom"
import Login from "./Components/AppPages/Login.jsx"
import VendorRegister from "./Components/AppPages/VendorRegister.jsx"
import Home from './Components/Home.jsx'
import About from './Components/About.jsx'
import Categories from './Components/Listings/Categories.jsx'
import Shops from './Components/Customer/Shops.jsx'
import Customer from './Components/Customer/Customer.jsx'
import Vendor from './Components/Vendor/Vendor.jsx'
import Cart from './Components/Customer/CartList.jsx'
import PlaceOrder from './Components/Orders/PlaceOrder.jsx'
import StoreFront from './Components/Customer/StoreFront.jsx'
import Inventory from './Components/Vendor/Inventory.jsx'
import OrderDetails from './Components/Orders/OrderDetail.jsx'
import OrdersPage from "./Components/Orders/OrdersPage.jsx"
import Error from './Components/AppPages/ErrorPage.jsx'
import Product from './Components/Vendor/Products/ProductList.jsx'
import AddProduct from './Components/Vendor/Products/AddProduct.jsx'
import NewProduct from './Components/Vendor/Products/NewProduct.jsx'
import Dashboard from './Components/Vendor/Dashboard.jsx'
import OrderHistory from './Components/Orders/OrderHistory.jsx'
import AccessBar from './Components/Customer/AccessBar.jsx'
import CustomerRegister from './Components/AppPages/CustomerRegister.jsx'
import Products from './Components/Customer/Products.jsx'
import RecentOrders from './Components/Orders/RecentOrders.jsx'
import ViewOrder from './Components/Orders/ViewOrder.jsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path='/signin' element={<Login />} />
            <Route path='/register/vendor' element={<VendorRegister />} />
            <Route path='/register/customer' element={<CustomerRegister />} />

            <Route path='/vendor/overview' element={<OrdersPage />} />
            <Route path='vendor/order' element={<OrderDetails />} />
            <Route path='vendor/history' element={<OrderHistory />} />
            <Route path='vendor/dashboard' element={<Dashboard />} />
            <Route path='vendor/inventory' element={<Inventory />} />
            <Route path='vendor/products' element={<Product />} />
            <Route path='vendor/products/add' element={<AddProduct />} />
            <Route path='vendor/products/new' element={<NewProduct />} />
            <Route path='/vendor/shop' element={<Vendor />} />
            <Route path='/accessbar' element={<AccessBar />} />

            <Route path='/categories' element={<Categories />} />
            <Route path='/shops' element={<Shops />} />
            <Route path='/shops/shop' element={<Vendor />} />
            <Route path='/about' element={<About />} />
            <Route path='/customer' element={<Customer />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order/place' element={<PlaceOrder />} />
            <Route path='/order/details' element={<ViewOrder />} />
            <Route path='/order/recent' element={<RecentOrders />} />
            <Route path='/order/history' element={<OrderHistory />} />
            <Route path='/products' element={<Products />} />
            <Route path='/storefront' element={<StoreFront />} />
            
            <Route path='/*' element={<Error />} />
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)

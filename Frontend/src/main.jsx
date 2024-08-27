import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom"
import Home from './Components/Home.jsx'
import Categories from './Components/Listings/Categories.jsx'
import Shops from './Components/Listings/Shops.jsx'
import Customer from './Components/Profiles/Customer.jsx'
import Vendor from './Components/Profiles/Vendor.jsx'
import Cart from './Components/Listings/Cart.jsx'
import Order from './Components/Listings/Order.jsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path='/categories' element={<Categories />} />
            <Route path='/shops' element={<Shops />} />
            <Route path='/customer' element={<Customer />} />
            <Route path='/vendor' element={<Vendor />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<Order />} />
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)

import Sidebar from "./Components/Vendor/Sidebar"
import AccessBar from "./Components/Customer/AccessBar.jsx"
import { Outlet, useNavigate } from 'react-router-dom'
import { decrypt } from './Components/utility.js'
import Cookies from "js-cookie"
import { useEffect } from 'react'

function App() {
    const navigate = useNavigate()

    const signedIn = Cookies.get("user")
    
    let user = signedIn ? decrypt() : null

    useEffect(() => {
        if (!signedIn) navigate("/signin")
      }, [])

    if (!signedIn) return <Outlet />
    
    return (
        <div className='font-poppins tracking-wider'>
            {
                user.userType === "vendor" ? <Sidebar /> : <AccessBar/>
            }
        </div>
    )
}

export default App

import Header from './Components/Header'
import Footer from './Components/Footer'
import Sidebar from "./Components/Vendor/Sidebar"
import { Outlet } from 'react-router-dom'

function App() {


  return (
    <div className='font-poppins'>
      {/* <Header/> */}
      <Sidebar />
      {/* <Outlet/> */}
      {/* <Footer /> */}
    </div>
  )
}

export default App

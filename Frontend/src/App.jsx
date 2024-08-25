import Header from './Components/Header'
import Footer from './Components/Footer'
import { Outlet } from 'react-router-dom'

function App() {


  return (
    <div className='font-poppins'>
      <Header/>
      <Outlet/>
      <Footer />
    </div>
  )
}

export default App

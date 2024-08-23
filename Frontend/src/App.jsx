import Home from './Components/Home'
import Header from './Components/Header'
import Footer from './Components/Footer'

function App() {


  return (
    <div>
      {/* <img src={logo} alt="Ummmm" className='logo h-64 mx-auto' />
      <h1 className=' text-7xl font-bold'>Mera Dukaan</h1>
      <h2 className=' text-2xl mt-2'>Online local community marketplace</h2> */}
      <Header/>
      <Home/>
      <Footer />
    </div>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Header from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import Footer from './components/Footer'

function App() {


  return (
<>
<BrowserRouter>
<Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/productListing' element={<ProductListing />} />
    </Routes>
<Footer />
   </BrowserRouter>
   </>
  )
}

export default App

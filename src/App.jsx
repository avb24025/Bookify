import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Login from './pages/Login';
import {Routes,Route} from "react-router-dom"
import Log from './pages/Log';
import Nav from './Components/Nav';
import List from './pages/List';
import Home from './pages/Home';
import Homepage from './pages/Home';
import BookifyLanding from './pages/BookifyLanding';
import Detail from './pages/Detail';
import Favourite from './pages/Favourite';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
function App() {
  return (
    <>
    <Nav></Nav>
    <Routes>
      <Route path='/' element={<BookifyLanding></BookifyLanding>}></Route>
      <Route path='/home' element={<Home></Home>}></Route>
      <Route path='/register' element={<Login></Login>}></Route>
      <Route path='/login' element={<Log></Log>}></Route>
      <Route path='/List' element={<List></List>}></Route>
      <Route path="/details/:id" element={<Detail />} />
      <Route path="/favourite" element={<Favourite></Favourite>} />
      <Route path="/cart" element={<Cart></Cart>} />
      <Route path="/orders" element={<Orders></Orders>} />

    </Routes>
    </>
  )
}

export default App

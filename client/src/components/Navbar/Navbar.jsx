// Navbar.jsx
import React, { useEffect, useState } from 'react';
import '../CSS FOLDER/Navbar.css'
import logo from '../../assets/logo.png'

const Navbar = () => {

  const [sticky, setSticky] = useState(false);

  useEffect(()=>{
    window.addEventListener('scroll', ()=>{
        window.scrollY > 50 ? setSticky(true) : setSticky(false);
      
      } )

  },[])

  
  return (
    <nav className={`container ${sticky ? 'dark-nav' : ''}`}>
      <img src={logo} alt="" className='logo' />
      <ul>
        <li> <a href = 'home'> Home </a> </li>
        <li> <a href = 'lib'> Library </a> </li>
        <li> <a href = 'gamesh'> Games </a> </li>
        <li> <a href = 'courierp'> Courier </a></li>
        <li> <a href = 'settingsp'> Settings </a></li>
        <li> <a href = 'aboutus'> About </a></li>
        <li> <a href = 'contactpage'>Contact</a></li>
        <li> <a href = 'prof' style={{color: 'rgb(186, 138, 114)' }}> Profile </a></li>
        <li><button className='btn'> <a href = 'login' style={{color: 'rgb(105, 64, 44)' }}> Log Out </a></button></li>
      </ul>
    </nav>
  );
};


export default Navbar;

// Navbar.jsx
import React, { useEffect, useState } from 'react';
import '../CSS FOLDER/Navbar.css'
import logo from '../../assets/logo.png'

const NavbarAdmin = () => {

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
      <li> <a href = 'homeadmin'> Home </a> </li>
        <li> <a href = 'digilibadmin'> Manage Books </a> </li>
        <li> <a href = 'libadmin'> Library </a></li>
        <li> <a href = 'settingsadmin'> Settings </a></li>
        <li> <a href = 'aboutus'> About </a></li>
        <li> <a href = 'contactpage'>Contact</a></li>
        <li> <a href = 'prof' style={{color: 'rgb(186, 138, 114)' }}> Profile </a></li>
        <li><button className='btn'> <a href = 'login' style={{color: 'rgb(105, 64, 44)' }}> Log Out </a></button></li>
      </ul>
    </nav>
  );
};


export default NavbarAdmin;

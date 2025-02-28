// App.jsx
import React from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import Hero from '../Navbar/Hero/Hero';
import Programs from '../Navbar/Programs/Programs';
import Title from '../Navbar/Title/Title';
import About from '../Navbar/About/About';


const App = () => {
  return (
    <div>
      <NavbarAdmin />
      <Hero />
      <div className="container">
      <Title subTitle='These images are placeholders' Title='Look at Here!'/>
      <Programs/>
      <About/>
      </div>
    </div>
  );
};

export default App;

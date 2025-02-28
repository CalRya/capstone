// App.jsx
import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Navbar/Hero/Hero';
import Programs from './components/Navbar/Programs/Programs';
import Title from './components/Navbar/Title/Title';
import About from './components/Navbar/About/About';


const App = () => {
  return (
    <div>
      <Navbar />
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

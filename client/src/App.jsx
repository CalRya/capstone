// App.jsx
import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Navbar/Hero/Hero';
import Programs from './components/Navbar/Programs/Programs';
import Title from './components/Navbar/Title/Title';
import About from './components/Navbar/About/About';
import LibraryPreview from './components/DigiLib/LibraryPreview';
import ArticlePreview from './components/DigiLib/ArticlePreview'


const App = () => {
  return (
    <div>
      <Navbar />
      <Hero/>
      <LibraryPreview/>
      <ArticlePreview/>
    </div>
  );
};

export default App;

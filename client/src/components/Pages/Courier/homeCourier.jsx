// App.jsx
import React from 'react';
import Navbar from '../../Navbar/NavbarCourier';
import Hero from '../../../components/Navbar/Hero/Hero';
import LibraryPreview from '../../../components/DigiLib/LibraryPreview';
import ArticlePreviewCourier from '../Courier/ArticlePreviewCourier';


const App = () => {
  return (
    <div>
      <Navbar />
      <Hero/>
      <LibraryPreview/>
      <ArticlePreviewCourier/>
    </div>
  );
};

export default App;

import React from 'react';
import '../CSS FOLDER/DigiLib.css';
import BookList from '../Admin/booklist';
import EditBook from '../Admin/editbook';
import BookDisplay from '../DigiLib/bookDisplay';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import ApproveBorrowRequests from './approvedBorrowBooks';

const DigiLib = () => {
  return (
    <div className="digilib-container"> {/* ✅ Added class for spacing */}
      <NavbarAdmin />
      <BookList/>
      <EditBook/>
      <ApproveBorrowRequests />
      
    </div>
  );
};

export default DigiLib;

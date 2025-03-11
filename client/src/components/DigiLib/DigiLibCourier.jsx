import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/NavbarCourier'; 
import BookDisplay from './bookDisplay';

const DigiLib = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Update URL when searchQuery changes
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('q', searchQuery);
    window.history.replaceState(null, '', `/courierlibrary?${newParams.toString()}`);
  }, [searchQuery]);

  return (
    <div>
      <Navbar onSearch={setSearchQuery} /> {/* ✅ Navbar updates search query */}
      <BookDisplay searchQuery={searchQuery} /> {/* ✅ Live filtering */}
    </div>
  );
};

export default DigiLib;
  
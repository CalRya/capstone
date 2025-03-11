import React, { useState } from 'react';
import Library from '../../../components/DigiLib/DigiLibCourier';
import NavbarCourier from '../../Navbar/NavbarCourier';

function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="App">
      <NavbarCourier onSearch={setSearchQuery} />
      <Library searchQuery={searchQuery} />
    </main>
  );
}

export default LibraryPage;

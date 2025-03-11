import React, { useState } from 'react';
import Library from '../../components/DigiLib/DigiLib';
import Navbar from '../Navbar/Navbar';

function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="App">
      <Navbar onSearch={setSearchQuery} />
      <Library searchQuery={searchQuery} />
    </main>
  );
}

export default LibraryPage;

import Admin from '../../Admin/Admin';
import ManageUsers from '../../Admin/manageUsers';
import NavbarAdmin from '../../Navbar/NavbarAdmin';
import LibrarianPanel from '../../Admin/LibrarianPanel';

function AboutPage() {

  return (
    <main className="App">
      <NavbarAdmin/>
      <Admin />
      <LibrarianPanel />
    </main>
  );
}

export default AboutPage;
import Admin from '../../Admin/Admin';
import ManageUsers from '../../Admin/manageUsers';
import NavbarAdmin from '../../Navbar/NavbarAdmin';

function AboutPage() {

  return (
    <main className="App">
      <NavbarAdmin/>
      <Admin />
      <ManageUsers/>
    </main>
  );
}

export default AboutPage;
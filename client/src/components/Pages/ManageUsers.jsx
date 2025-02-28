import ManageUsers from '../Admin/manageUsers';
import NavbarAdmin from '../Navbar/NavbarAdmin';

function AboutPage() {

  return (
    <main className="App">
      <NavbarAdmin/>
      <ManageUsers />
    </main>
  );
}

export default AboutPage;
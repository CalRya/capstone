import DigiLibA from '../../Admin/DigiLibAdmin';
import NavbarAdmin from '../../Navbar/NavbarAdmin';
import ApprovedBorrowBooks from '../../Admin/approvedBorrowBooks';

function AdminLib() {

  return (
    <main className="App">
        <NavbarAdmin/>
      <ApprovedBorrowBooks/>
    </main>
  );
}

export default AdminLib;
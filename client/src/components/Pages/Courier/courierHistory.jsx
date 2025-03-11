import NavbarCourier from '../../Navbar/NavbarCourier';
import BorrowBooks from "../../DigiLib/borrowedBooks";


function Prof() {
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null; // Parse stored user

  console.log("🔍 Debug: currentUser", currentUser); // Check if user exists

  return (
    <main className="App">
      <NavbarCourier />
      <BorrowBooks />
    </main>
    
  );
}

export default Prof;
  
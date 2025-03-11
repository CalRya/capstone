import Navbar from "../Navbar/Navbar";
import BorrowBooks from "../DigiLib/borrowedBooks";
import UserProfile from "../Profile/UserProfile";


function Prof() {
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null; // Parse stored user

  console.log("🔍 Debug: currentUser", currentUser); // Check if user exists

  return (
    <main className="App">
      <Navbar />
      <BorrowBooks />
    </main>
    
  );
}

export default Prof;
  
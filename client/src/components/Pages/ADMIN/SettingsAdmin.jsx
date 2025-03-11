import NavbarAdmin from "../Navbar/NavbarAdmin";
import UserProfile from "../Profile/UserProfile";


function Prof() {
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null; // Parse stored user

  console.log("🔍 Debug: currentUser", currentUser); // Check if user exists

  return (
    <main className="App">
      <NavbarAdmin/>
      {currentUser ? (
        <UserProfile userId={currentUser.id} />
      ) : (
        <p>Loading user...</p>
      )}
    </main>
    
  );
}

export default Prof;
  
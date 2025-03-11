import NavbarCourier from '../../Navbar/NavbarCourier';
import UserProfile from "../../Profile/Profile";
import Premium from "../../Profile/Premium";

function Prof() {
    const storedUser = localStorage.getItem("currentUser");
    const currentUser = storedUser ? JSON.parse(storedUser) : null; // Parse stored user

    console.log("🔍 Debug: currentUser", currentUser); // Check if user exists

    return (
        <main className="App">  
            <NavbarCourier />
            <div style={{ marginTop: "80px", position: "relative", zIndex: 1, padding: "20px" }}>
                {currentUser ? (
                    <>
                        <UserProfile userId={currentUser.id} />
                        <div style={{ position: "relative", zIndex: 1, marginTop: "20px", padding: "20px" }}>
                            <Premium userId={currentUser.id} />
                        </div>
                    </>
                ) : (
                    <p>Loading user...</p>
                )}
            </div>
        </main>
    );
}

export default Prof;

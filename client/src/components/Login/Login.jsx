import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS FOLDER/Login.css';
import axios from '../api/axios';

function Login() {
    const [email, setEmail] = useState('');  // Updated to use email
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await axios.post('http://localhost:3004/login', { email, password });

            console.log("✅ Server Response:", result.data);

            if (result.data?.message?.includes("Login successful")) {
                const { id, email, role } = result.data;

                if (!id || !email || !role) {
                    setErrMsg("Login error: Missing user details.");
                    return;
                }

                const userData = { id, email, role };
                localStorage.setItem("currentUser", JSON.stringify(userData));

                switch (userData.role) {
                    case 'admin': navigate('/homeadmin'); break;
                    case 'librarian': navigate('/librarian'); break;
                    case 'courier': navigate('/courier-dashboard'); break;
                    default: navigate('/home');
                }
            } else {
                setErrMsg("Invalid credentials.");
            }
        } catch (err) {
            setErrMsg(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>

                {/* Email Field */}
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    autoComplete="off"
                    onChange={(e) => { setEmail(e.target.value); setErrMsg(''); }}
                    value={email}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => { setPassword(e.target.value); setErrMsg(''); }}
                    value={password}
                    required
                />

                <button>Sign In</button>
            </form>

            <p>Need an Account? <Link to="/">Sign Up</Link></p>
        </section>
    );
}

export default Login;

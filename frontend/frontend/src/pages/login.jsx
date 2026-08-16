import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/auth";

function Login() {
    const { loginUser } = useAuth(); //access the loginUser function from the AuthContext
    const navigate = useNavigate(); //navigate- helps to redirect to another page after successful login

    const [email, setEmail] = useState(""); //start with empty string("")
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault(); //prevent the default form submission behavior, which would cause a page reload
        try {
            const response = await login({ email, password }); //call the login function from client.js with email and password
            loginUser(response); //call the loginUser function from the AuthContext to store the token and user data in localStorage
            navigate("/"); //redirect to home page after successful login
        } catch (err) {
            setError(err.message);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                {error && <p>{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} //update the email state variable when user types in the input field
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} //update the password state variable when user types in the input field
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
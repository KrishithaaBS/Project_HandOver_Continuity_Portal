import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signup } from "../api/auth";

function Signup() {
    const { loginUser } = useAuth(); //acess the loginUser function from the AuthContext
    const navigate = useNavigate(); //navigate- helps to redirect to another page after successful login

    const [username, setUsername] = useState(""); //start with empty string("")
    const [email, setEmail] = useState(""); //start with empty string("")
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault(); //prevent the default form submission behavior, which would cause a page reload
        try {
            const response = await signup({ username, email, password }); //call the login function from client.js with email and password
            navigate("/login"); //redirect to home page after successful login
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {error && <p>{error}</p>} 
                <input
                    type="text"
                    placeholder="Username"
                    value={username} //display the current value of the username state variable in the input field
                    onChange={(e) => setUsername(e.target.value)} //update the username state variable when user types in the input field
                />
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

                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;
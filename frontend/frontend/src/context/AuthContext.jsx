import { createContext } from "react";
import { useContext, useState } from "react"; //useState lets your component remember/change data

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    //usestate - makes token a state variable, so that it can be updated and the component can re-render when it changes
    //get the token
    const [token, setToken] = useState( //setToken → function to change the token
        () => localStorage.getItem("token") //localstorage- helps browser remember data even after refresh
    );

    //get the user
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user"); //localstorage stores user data as string
        return storedUser ? JSON.parse(storedUser) : null; //parse- string to object
    });

    function loginUser(response) {
        //response from client.jsx after successful login/signup
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.data)); //stringify- object to string
        //update the state variables
        setToken(response.token);
        setUser(response.data);
    }

    function logoutUser() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }

    const isAuthenticated = !!token; //convert token to boolean

    return (
    <AuthContext.Provider
        value={{
            user,
            isAuthenticated,
            loginUser,
            logoutUser
        }}
    >
        {children}
    </AuthContext.Provider>
);

}

//custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
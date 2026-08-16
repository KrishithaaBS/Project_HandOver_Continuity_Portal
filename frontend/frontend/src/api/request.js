const BASE_URL = "http://localhost:3000/api";

// Get the JWT token stored after login
function getToken() {
    return localStorage.getItem("token");
}

// Shared function all api file (auth, projects, meetings, requests) request
export async function request(path, { method = "GET", body, auth = true } = {}) {
    const headers = {
        "Content-Type": "application/json",
    };

    // Add JWT token unless the caller explicitly opts out (only signup/login do)
    if (auth) {
        const token = getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    //handle unsuccessful responses
    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

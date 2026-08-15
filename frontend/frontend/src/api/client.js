const BASE_URL = "http://localhost:3000/api";

// Get the JWT token stored after login
function getToken() {
  return localStorage.getItem("token");
}

// Common function for making API requests
async function request(
  path,
  { method = "GET", body, auth = true } = {}
) {
  const headers = {
    "Content-Type": "application/json",
  };

  // Add JWT token only when authentication is required
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

  // Handle unsuccessful responses
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Signup API
export function signup({ username, email, password }) {
  return request("/auth/signup", {
    method: "POST",
    body: { username, email, password },
    auth: false,
  });
}

// Login API
export function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}
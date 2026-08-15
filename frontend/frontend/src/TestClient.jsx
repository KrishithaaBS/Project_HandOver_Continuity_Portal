import { signup, login } from "./api/client";

function TestClient() {
  async function testSignup() {
    try {
      const result = await signup({
        username: "testuser3",
        email: "test3@gmail.com",
        password: "123456",
      });

      console.log("Signup success:", result);
    } catch (error) {
      console.error("Signup error:", error.message);
    }
  }

  async function testLogin() {
    try {
      const result = await login({
        email: "test3@gmail.com",
        password: "123456",
      });

      console.log("Login success:", result);
    } catch (error) {
      console.error("Login error:", error.message);
    }
  }

  return (
    <div>
      <button onClick={testSignup}>Test Signup</button>
      <button onClick={testLogin}>Test Login</button>
    </div>
  );
}

export default TestClient;
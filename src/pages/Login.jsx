import React, { useState, useEffect } from "react";
import { useFirebase } from "../Context/Firebase"; // Ensure the import path is correct
import { useNavigate } from "react-router-dom";
import styles from './Login.module.css'; // Import the CSS module

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const firebase = useFirebase(); // Accessing the Firebase instance

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await firebase.createUser(email, pass);
      console.log("Login successful!");
    } catch (error) {
      console.error("Login failed:", error.message);
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firebase.isLogin) {
      // Navigate to home
      navigate("/home");
    }
  }, [firebase, navigate]);

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className={`container mt-5 ${styles.loginContainer}`}>
        <h2 className="text-center mb-4">Create Your Account</h2>
        <form onSubmit={handleOnSubmit} className={styles.loginForm}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              required
            />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input
              type="password"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              className="form-control"
              id="exampleInputPassword1"
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className={`btn btn-primary w-100 ${styles.btnPrimary}`} disabled={loading}>
            {loading ? "Logging in..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

import React, { useEffect, useState } from "react";
import { useFirebase } from "../Context/Firebase"; 
import { useNavigate } from "react-router-dom";
import styles from './Log.module.css'; // Import the CSS module

const Log = () => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signIn, signInWithGoogle, user } = useFirebase(); // Use user from Firebase context
    const navigate = useNavigate();

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signIn(email, pass);
            console.log("Login successful!");
        } catch (error) {
            console.error("Login failed:", error.message);
            if (error.code === 'auth/wrong-password') {
                setError("Invalid password.");
            } else if (error.code === 'auth/user-not-found') {
                setError("No user found with this email.");
            } else {
                setError("Failed to log in. Please check your credentials.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/home"); // Redirect to home if user is logged in
        }
    }, [user, navigate]); // Watch for user changes

    return (
        <div className={styles.loginContainer}>
            <h2>Login to Your Account</h2>
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
                <button type="submit" className={`btn btn-primary ${styles.btnPrimary}`} disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Submit"}
                </button>
            </form>
            <div className="text-center my-4">
                <button 
                    type="button" 
                    onClick={signInWithGoogle} 
                    className={`btn btn-secondary ${styles.btnSecondary}`}
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Log;

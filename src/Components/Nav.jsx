import { NavLink, useLocation } from "react-router-dom";
import { useFirebase } from "../Context/Firebase"; 
import styles from './Nav.module.css';
import { FaShoppingCart } from "react-icons/fa";

const Nav = () => {
    const firebase = useFirebase();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await firebase.logout();
            console.log("Logout successful!");
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    return (
        <nav className={`${styles.navbar} navbar navbar-expand-lg`}>
            <div className="container-fluid">
                <NavLink className={`${styles.navbarBrand} navbar-brand`} to="/home">Bookify</NavLink>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink 
                                to="/home" 
                                className={({ isActive }) => `${styles.navLink} btn ${isActive ? 'active' : ''}`} 
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item mx">
                            <NavLink 
                                to="/list" 
                                className={({ isActive }) => `${styles.navLink} btn ${isActive ? 'active' : ''}`} 
                            >
                                List Book
                            </NavLink>
                        </li>
                        <li className="nav-item mx">
                            <NavLink 
                                to="/favourite" 
                                className={({ isActive }) => `${styles.navLink} btn ${isActive ? 'active' : ''}`} 
                            >
                                Favorites
                            </NavLink>
                        </li>
                        {/* New Orders Button */}
                        <li className="nav-item mx">
                            <NavLink 
                                to="/orders" 
                                className={({ isActive }) => `${styles.navLink} btn ${isActive ? 'active' : ''}`} 
                            >
                                Orders
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="d-flex flex-column flex-lg-row">
                    {firebase.isLogin ? (
                        <>
                            <NavLink to="/cart" className={styles.cartIcon}>
                                <FaShoppingCart size={35} className={styles.cartIcon} />
                            </NavLink>
                            <button 
                                type="button" 
                                className={`${styles.btnWarning} btn`} 
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink 
                                to="/login" 
                                className={({ isActive }) => `${styles.btnPrimary} btn me-2 ${isActive ? 'active' : ''}`}
                            >
                                Login
                            </NavLink>
                            <NavLink 
                                to="/register" 
                                className={({ isActive }) => `${styles.btnSecondary} btn ${isActive ? 'active' : ''}` }
                            >
                                Sign Up
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav; 

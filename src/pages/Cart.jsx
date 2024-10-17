import React, { useEffect, useState } from "react";
import { useFirebase } from "../Context/Firebase"; // Import Firebase context
import Cartcard from "../Components/Cartcard"; // Using Cartcard for displaying books
import styles from "./Cart.module.css"; // Import the CSS module

const Cart = () => {
    const firebase = useFirebase();
    const [cartBooks, setCartBooks] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [orderStatus, setOrderStatus] = useState({}); // Order status map

    const fetchCartBooks = async () => {
        setLoading(true); // Set loading to true before fetching

        // Check if user is logged in
        if (!firebase.isLogin) {
            setError("You must be logged in to view your cart.");
            setLoading(false);
            return; // Exit if the user is not logged in
        }

        try {
            const booksInCart = await firebase.getCartBooks(); // Fetch the books in the cart
            setCartBooks(booksInCart); // Set the cart books in state

            // Fetch the order status for each book from Firebase
            const fetchedOrderStatus = await firebase.getOrderStatusForBooks(booksInCart.map(book => book.bookId));

            // Initialize order status for each book
            const initialOrderStatus = {};
            booksInCart.forEach(book => {
                initialOrderStatus[book.bookId] = fetchedOrderStatus[book.bookId] || false; // Set order status for each book
            });

            setOrderStatus(initialOrderStatus); // Set the initial order statuses

        } catch (error) {
            setError("Error fetching cart books: " + error.message);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    // Effect to fetch cart books only when user logs in or logs out
    useEffect(() => {
        if (firebase.isLogin) {
            fetchCartBooks();
        } else {
            setCartBooks([]); // Clear cart books if user is not logged in
            setOrderStatus({}); // Clear order status as well
        }
    }, [firebase.isLogin]); // Re-run the effect when isLogin changes

    // Handle removing book from the cart
    const handleCartToggle = async (id) => {
        try {
            await firebase.removeBookFromCart(id); // Remove the book from cart in Firebase
            setCartBooks(prev => prev.filter(book => book.bookId !== id)); // Update the local state to reflect removal
            setOrderStatus(prev => ({
                ...prev,
                [id]: false, // Reset order status
            }));
        } catch (error) {
            console.error("Error removing book from cart:", error.message);
            alert("Failed to remove the book from the cart.");
        }
    };

    // Update order status for a specific book
    const updateOrderStatus = (id, status) => {
        setOrderStatus(prevStatus => ({
            ...prevStatus,
            [id]: status, // Update the order status for the specific book
        }));
    };

    // Calculate the total price of the books in the cart
    const calculateTotalPrice = () => {
        return cartBooks.reduce((total, book) => total + book.price, 0).toFixed(2); // Sum the prices
    };

    return (
        <div className={styles.cartContainer}>
            <h2 className={styles.head}> Your Cart</h2>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            ) : (
                cartBooks.length === 0 ? (
                    <p className={styles.emptyCart}>Your cart is empty.</p>
                ) : (
                    <div>
                        <div className={styles.bookGrid}>
                            {cartBooks.map(book => (
                                <Cartcard
                                    key={book.bookId}
                                    id={book.bookId}
                                    name={book.name}
                                    price={book.price}
                                    addedby={book.addedby}
                                    imageURL={book.imageURL}
                                    onCartUpdate={handleCartToggle} // Pass the removal handler
                                    isOrdered={orderStatus[book.bookId]} // Pass the order status
                                    updateOrderStatus={updateOrderStatus} // Pass the update order status function
                                />
                            ))}
                        </div>
                        {/* <h3 className={styles.totalPrice}>
                            Total Price: <span>${calculateTotalPrice()}</span>
                        </h3> */}
                    </div>
                )
            )}
        </div>
    );
};

export default Cart;

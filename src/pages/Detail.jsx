import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../Context/Firebase";
import styles from "./Detail.module.css"; // Importing CSS module for styling

const Detail = () => {
    const { id } = useParams(); // Get the book ID from the URL
    const firebase = useFirebase();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State to handle errors
    const [isPurchasing, setIsPurchasing] = useState(false); // State for purchase process

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const allBooks = await firebase.listallbooks();
                const selectedBook = allBooks.find((book) => book.id === id);
                if (selectedBook) {
                    setBook(selectedBook);
                } else {
                    setError("Book not found"); // Handle book not found
                }
            } catch (error) {
                console.error("Error fetching book details:", error.message);
                setError(error.message || "Failed to fetch book details."); // Set error message
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id, firebase]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
            </div>
        );
    }

    const handleBuyNow = async () => {
        setIsPurchasing(true);
        console.log("Buying book:", book.name);
        // Simulate a purchase process
        setTimeout(() => {
            setIsPurchasing(false);
            alert("Thank you for your purchase!"); // Placeholder action
        }, 2000);
    };

    return (
        <div className={styles.detailContainer}>
            {book.imageURL && (
                <img
                    src={book.imageURL}
                    alt={`Cover image of ${book.name}`}
                    className={styles.bookImage}
                />
            )}
            <h2 className={styles.bookTitle}>{book.name}</h2>
            <p className={styles.bookPrice}><strong>Price:</strong> ${book.price}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Added by:</strong> {book.userEmail}</p>
            <button
                className={styles.buyNowButton}
                onClick={handleBuyNow}
                disabled={isPurchasing} // Disable button while processing
            >
                {isPurchasing ? 'Processing...' : 'Connect to Buy'}
            </button>
        </div>
    );
};

export default Detail;

import React, { useEffect, useState } from "react";
import { useFirebase } from "../Context/Firebase";
import Bookcard from "../Components/Bookcard";
import styles from "./Home.module.css"; // Import the CSS module

const Home = () => {
    const firebase = useFirebase();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); // Error state
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true); // Start loading
            setError(""); // Reset error state
            try {
                const response = await firebase.listallbooks();
                console.log("Firestore response:", response);
                setBooks(response);
            } catch (error) {
                console.error("Error fetching books:", error);
                setError("Failed to load books. Please try again later.");
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchBooks();
    }, [firebase]);

    // Function to handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter books based on search term
    const filteredBooks = books.filter((book) =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            {/* Search bar */}
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search for a book..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
            </div>
            {/* Styled text */}
            <h3 className={styles.descriptionText}>
            At Bookify you can buy second-hand books and sell old books online at the best prices. Selling used books online for cash made easy with Bookify!

            </h3>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? ( // Show error message
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            ) : (
                <div className={styles.bookList}>
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <Bookcard key={book.id} {...book} />
                        ))
                    ) : (
                        <p className={styles.noBooks}>No books available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;

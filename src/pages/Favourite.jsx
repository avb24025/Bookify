import React, { useEffect, useState } from "react";
import { useFirebase } from "../Context/Firebase";
import Likecard from "../Components/Likecard"; // Import Likecard
import styles from "./Favourite.module.css"; // Import CSS module for Favorites

const Favorites = () => {
    const firebase = useFirebase();
    const [favoriteBooks, setFavoriteBooks] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const favorites = await firebase.getFavoriteBooks();
            console.log("Fetched favorites:", favorites);
            setFavoriteBooks(favorites);
        };
        

        fetchFavorites();
    }, [firebase]);

    const handleLikeToggle = (id) => {
        setFavoriteBooks((prevFavorites) =>
            prevFavorites.some(book => book.bookId === id)
                ? prevFavorites.filter(book => book.bookId !== id)
                : [...prevFavorites, { bookId: id }]
        );
    };

    return (
        <div className={styles.favoritesContainer}>
            <h2>Your Favorite Books</h2>
            <div className={styles.bookGrid}>
                {favoriteBooks.map(book => (
                    <Likecard
                        key={book.bookId}
                        id={book.bookId}
                        name={book.name}
                        price={book.price} 
                        addedby={book.addedby}
                        userEmail={book.userEmail}
                        imageURL={book.imageURL}
                        onLikeToggle={handleLikeToggle} // Pass the callback
                    />
                ))}
            </div>
        </div>
    );
};

export default Favorites;

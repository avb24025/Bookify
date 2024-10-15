import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useFirebase } from "../Context/Firebase";
import styles from "./Likecard.module.css"; // CSS for Likecard
import { FcLikePlaceholder, FcLike } from "react-icons/fc"; // Import the like icons
import { TiShoppingCart } from "react-icons/ti";
import { MdOutlineShoppingCart } from "react-icons/md";

const Likecard = ({ id, name, price,addedby, userEmail, imageURL, onLikeToggle }) => {
    const firebase = useFirebase();
    const [url, setUrl] = useState(null);
    const [isLiked, setIsLiked] = useState(false); // State for like status
    const isLogin = firebase.isLogin; // Check if the user is logged in

    useEffect(() => {
        const fetchImage = async () => {
            if (imageURL) {
                try {
                    const imageUrl = await firebase.getimg(imageURL);
                    setUrl(imageUrl);
                } catch (error) {
                    console.error("Error fetching image:", error.message);
                }
            } else {
                console.warn("No imageURL provided for:", id);
            }
        };

        fetchImage();
    }, [imageURL, firebase, id]);

    useEffect(() => {
        const checkIfLiked = async () => {
            if (isLogin) {
                const favoriteBooks = await firebase.getFavoriteBooks();
                const isBookLiked = favoriteBooks.some(book => book.bookId === id);
                setIsLiked(isBookLiked); // Update the like state based on favorites
            }
        };

        checkIfLiked();
    }, [isLogin, firebase, id]);

    // Function to toggle like
    const toggleLike = async () => {
        if (isLogin) {
            try {
                if (isLiked) {
                    // Remove from favorites
                    await firebase.removeFavoriteBook(id);
                    onLikeToggle(id); // Call the callback to update the parent
                } else {
                    // Add to favorites
                    await firebase.addFavoriteBook({ id, name, price, imageURL,addedby});
                    onLikeToggle(id); // Call the callback to update the parent
                }
                setIsLiked(!isLiked); // Toggle like state
            } catch (error) {
                console.error("Error updating favorite books:", error.message);
                alert("An error occurred while updating your favorites.");
            }
        } else {
            alert('Please log in to like this book');
        }
    };

    console.log({ id, name, price, addedby, userEmail, imageURL });


    return (
        <div className={styles.card}>
            {url ? (
                <img src={url} className={styles.fixedHeightImage} alt={name || "Book cover"} />
            ) : (
                <p>Loading image...</p>
            )}
            <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>{name}</h5>
                <p className={styles.cardText}>Price: ${price}</p>
                <p className={styles.cardText}>Added by: {addedby}</p>
                <div className={styles.foot}>
                    {/* Link to the book details */}
                    <Link to={`/details/${id}`} className={`btn btn-primary ${styles.btn}`}>
                        View Details
                    </Link>
                    <div className={styles.cart}>
                     {/* <TiShoppingCart size={30}/> */}
                     <MdOutlineShoppingCart size={30}/>

                 {/* Like button, clickable only when the user is logged in */}
                <span onClick={toggleLike} style={{ cursor: isLogin ? 'pointer' : 'not-allowed' }}>
                {isLiked ? <FcLike size={30} /> : <FcLikePlaceholder size={30} />}
               </span>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default Likecard;

import React, { useEffect, useState } from "react";
import { useFirebase } from "../Context/Firebase";
import { Link } from "react-router-dom";
import styles from "./Bookcard.module.css";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { BsCartPlus, BsCartPlusFill } from "react-icons/bs"; // Import cart icons

const Bookcard = (props) => {
    const firebase = useFirebase();
    const [url, setUrl] = useState(null);
    const [isLiked, setIsLiked] = useState(false); // State to manage the like toggle
    const [cart, setCart] = useState(false); // State for the cart toggle
    const isLogin = firebase.isLogin; // Check if the user is logged in
    const user=firebase.user
    useEffect(() => {
        const fetchImage = async () => {
            if (props.imageURL) {
                try {
                    const imageUrl = await firebase.getimg(props.imageURL);
                    setUrl(imageUrl);
                } catch (error) {
                    console.error("Error fetching image:", error.message);
                }
            }
        };

        fetchImage();
    }, [props.imageURL, firebase]);

    useEffect(() => {
        const checkIfLiked = async () => {
            if (isLogin) {
                const favoriteBooks = await firebase.getFavoriteBooks();
                const isBookLiked = favoriteBooks.some(book => book.bookId === props.id);
                setIsLiked(isBookLiked); // Update the like state based on favorites
            }
        };

        const checkIfInCart = async () => {
            if (isLogin) {
                const cartBooks = await firebase.getCartBooks();
                const isBookInCart = cartBooks.some(book => book.bookId === props.id);
                setCart(isBookInCart); // Update cart state based on whether the book is in the cart
            }
        };

        checkIfLiked();
        checkIfInCart();
    }, [isLogin, firebase, props.id]);

    // Function to toggle like
    const toggleLike = async () => {
        if (isLogin) {
            try {
                if (isLiked) {
                    // Remove from favorites
                    await firebase.removeFavoriteBook(props.id);
                } else {
                    // Add to favorites
                    await firebase.addFavoriteBook({ id: props.id, name: props.name, price: props.price, imageURL: props.imageURL ,addedby:props.userEmail});
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

    // Function to toggle cart
    const toggleCart = async () => {
        if (isLogin) {
            try {
                if (cart) {
                    // Remove from cart
                    await firebase.removeBookFromCart(props.id);
                } else {
                    // Add to cart
                    await firebase.addBookToCart({ id: props.id, name: props.name, price: props.price, imageURL: props.imageURL, addedby: props.userEmail });
                }
                setCart(!cart); // Toggle cart state
            } catch (error) {
                console.error("Error updating cart:", error.message);
                alert("An error occurred while updating your cart.");
            }
        } else {
            alert('Please log in to add books to the cart');
        }
    };

    return (
        <div className={styles.card}>
            {url && <img src={url} className={styles.fixedHeightImage} alt={props.name || 'Book cover'} />}
            <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>{props.name}</h5>
                <p className={styles.cardText}>Price: ${props.price}</p>
                <p className={styles.cardText}>Category:{props.isbn}</p>
                <p className={styles.cardText}>Added by: {props.userEmail}</p>
                <div className={styles.foot}>
                    {/* Link to the details page with the book's ID */}
                    <Link to={`/details/${props.id}`} className={`btn btn-primary ${styles.btn}`}>View Details</Link>
                    
                    <div className={styles.cart}>
                        {/* Cart button, toggle the cart state on click */}
                        <span onClick={toggleCart} style={{ cursor: 'pointer' }}>
                            {cart ? <BsCartPlusFill size={30} /> : <BsCartPlus size={30} />}
                        </span>
                        
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

export default Bookcard;

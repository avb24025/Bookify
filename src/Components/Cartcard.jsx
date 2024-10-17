import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "../Context/Firebase";
import styles from "./Cartcard.module.css"; // CSS for Cartcard

const Cartcard = ({ id, name, price, addedby, imageURL, onCartUpdate, isOrdered, updateOrderStatus }) => {
    const firebase = useFirebase();
    const [url, setUrl] = useState(null);
    const isLogin = firebase.isLogin;

    useEffect(() => {
        const fetchImage = async () => {
            if (imageURL) {
                try {
                    const imageUrl = await firebase.getimg(imageURL);
                    setUrl(imageUrl);
                } catch (error) {
                    console.error("Error fetching image:", error.message);
                }
            }
        };
        fetchImage();
    }, [imageURL, firebase]);

    const removeFromCart = async () => {
        if (isLogin) {
            try {
                await firebase.removeBookFromCart(id);
                onCartUpdate(id);
            } catch (error) {
                console.error("Error removing from cart:", error.message);
                alert("An error occurred while removing the book from your cart.");
            }
        } else {
            alert('Please log in to remove books from the cart');
        }
    };

    const handleBuy = async () => {
        if (isLogin) {
            try {
                await firebase.createOrder(id, name, price, addedby);
                await firebase.updateOrderStatus(id, true); // Update order status in Firebase
                updateOrderStatus(id, true); // Update local state
                alert(`Order for ${name} has been placed successfully!`);
            } catch (error) {
                console.error("Error placing order:", error.message);
                alert("An error occurred while placing the order.");
            }
        } else {
            alert('Please log in to purchase books.');
        }
    };

    const handleCancelOrder = async () => {
        if (isLogin) {
            try {
                const success = await firebase.cancelOrder(id);
                if (success) {
                    await firebase.updateOrderStatus(id, false); // Update order status in Firebase
                    updateOrderStatus(id, false); // Update local state
                    alert(`Order for ${name} has been cancelled successfully!`);
                }
            } catch (error) {
                console.error("Error cancelling order:", error.message);
                alert("An error occurred while cancelling the order.");
            }
        } else {
            alert('Please log in to cancel orders.');
        }
    };

    return (
        <div className={styles.card}>
            {url ? (
                <img src={url} className={styles.fixedHeightImage} alt={name || "Book cover"} />
            ) : (
                <p>Loading image...</p>
            )}
            <div className={styles.cardBody}>
                <h5 className={styles.cardTitle}>{name}</h5>
                <p className={styles.cardText}>Price: ${price.toFixed(2)}</p>
                <p className={styles.cardText}>Owner: {addedby}</p>
                <div className={styles.foot}>
                    <Link to={`/details/${id}`} className={`btn btn-primary ${styles.btn}`}>
                        View Details
                    </Link>
                    <div className={styles.cart}>
                        <button 
                            onClick={removeFromCart} 
                            className={styles.removeButton}
                        >
                            Remove
                        </button>
                        {isOrdered ? (
                            <button 
                                onClick={handleCancelOrder} 
                                className={`btn btn-danger ${styles.cancelButton}`} 
                            >
                                Cancel Order
                            </button>
                        ) : (
                            <button 
                                onClick={handleBuy} 
                                className={`btn btn-success ${styles.buyButton}`} 
                            >
                                Connect to Buy
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cartcard;

import React, { useEffect, useState } from 'react';
import { useFirebase } from "../Context/Firebase";
import styles from './Orders.module.css';  // Import the new CSS module

const Order = () => {
    const { getUserOrders, cancelOrder, user } = useFirebase();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // State for error handling
    const [cancelError, setCancelError] = useState(null);  // State for cancel order error handling
    const [cancelSuccess, setCancelSuccess] = useState(null);  // State for cancel order success

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;  // Ensure the user is logged in before fetching orders

            try {
                const fetchedOrders = await getUserOrders();  // Fetch orders for the logged-in user
                setOrders(fetchedOrders);  // Set orders in state
            } catch (error) {
                console.error("Error fetching user orders:", error);
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);  // Stop loading after the data is fetched
            }
        };

        fetchOrders();  // Call the function to fetch orders when the component mounts
    }, [getUserOrders, user]);  // Add dependencies on `getUserOrders` and `user`

    const handleCancelOrder = async (bookId) => {
        setCancelError(null);  // Reset error state
        setCancelSuccess(null);  // Reset success state

        try {
            await cancelOrder(bookId);
            setCancelSuccess("Order cancelled successfully!");
            // Re-fetch orders after canceling to reflect changes
            const fetchedOrders = await getUserOrders();
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Error canceling order:", error);
            setCancelError(error.message || "Failed to cancel order.");
        }
    };

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

    if (!user) {
        return <p className={styles.errorMessage}>You must be logged in to view your orders.</p>;
    }

    return (
        <div className={styles.ordersContainer}>
            <h1>Your Orders</h1>
            {cancelError && <div className="alert alert-danger">{cancelError}</div>}
            {cancelSuccess && <div className="alert alert-success">{cancelSuccess}</div>}
            {orders.length > 0 ? (
                <div className={styles.orderList}>
                    {orders.map(order => (
                        <div className={styles.orderItem} key={order.id}>
                            <h3 className={styles.bookName}>{order.bookName}</h3>
                            <p><strong>Price:</strong> ${order.price}</p>
                            <p><strong>Ordered by:</strong> {order.orderedBy}</p>
                            <p><strong>Owner:</strong> {order.addedBy}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
                            <button 
                                className={styles.rejectButton} 
                                onClick={() => handleCancelOrder(order.bookId)} // Call cancelOrder with bookId
                            >
                                Reject Order
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.noOrders}>No orders found.</p>
            )}
        </div>
    );
};

export default Order;

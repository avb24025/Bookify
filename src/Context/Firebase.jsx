import { createContext, useContext, useState, useEffect } from "react"; 
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Create a context for Firebase
const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAFd2mQfRVj0EoXX91ND5Ou6Ox51O4gPRI",
    authDomain: "bookify-33636.firebaseapp.com",
    projectId: "bookify-33636",
    storageBucket: "bookify-33636.appspot.com",
    messagingSenderId: "334360958447",
    appId: "1:334360958447:web:d92b83bede27b5a02c521a"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);  
const firebaseAuth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Firebase Provider Component
export const FirebaseProvider = (props) => {
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            setUser(user || null);
            setIsLogin(!!user);
        });
        return () => unsubscribe(); // Cleanup subscription
    }, []);

    // Create User
    const createUser = async (email, pass) => {
        try {
            await createUserWithEmailAndPassword(firebaseAuth, email, pass);
        } catch (error) {
            console.error("Error creating user:", error.message);
            throw error; 
        }
    };

    // Sign In
    const signIn = async (email, pass) => {
        try {
            await signInWithEmailAndPassword(firebaseAuth, email, pass);
        } catch (error) {
            console.error("Error signing in:", error.message);
            throw error; 
        }
    };

    // Sign In with Google
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(firebaseAuth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            throw error; 
        }
    };

    // Create Book List
    const createlist = async (name, isbn, price, cover) => {
        try {
            const imgRef = ref(storage, `uploads/images/${Date.now()}-${cover.name}`);
            const uploadRes = await uploadBytes(imgRef, cover);
            const imageUrl = await getDownloadURL(uploadRes.ref);

            await addDoc(collection(firestore, 'books'), {
                name,
                isbn,
                price,
                imageURL: imageUrl,
                userID: user.uid,
                userEmail: user.email,
            });
        } catch (error) {
            console.error("Error creating list:", error);
            throw error; 
        }
    };

    // List All Books
    const listallbooks = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'books'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching books:", error.message);
            throw error; 
        }
    };

    // Get Image
    const getimg = async (path) => {
        try {
            return await getDownloadURL(ref(storage, path));
        } catch (error) {
            console.error("Error getting image:", error.message);
            throw error; 
        }
    };

    // Create Order
   // Create Order
const createOrder = async (bookId, bookName, price, addedByEmail) => {
    if (!user) throw new Error("User must be logged in to create an order.");

    try {
        // Check if the logged-in user is trying to order their own book
        if (user.email === addedByEmail) {
            throw new Error("You cannot order your own book. Please choose another book.");
        }

        const ordersDocRef = doc(firestore, "orders", addedByEmail); // Use addedByEmail as document ID

        // Check if the document already exists
        const ordersDoc = await getDoc(ordersDocRef);

        // Check if the user has already ordered the book
        if (ordersDoc.exists()) {
            const existingOrders = ordersDoc.data().orders || [];
            const hasOrdered = existingOrders.some(order => order.bookId === bookId && order.orderedBy === user.email);

            if (hasOrdered) {
                throw new Error("You have already purchased this book.");
            }

            // If the document exists, update it by adding the new order to the existing array
            await setDoc(ordersDocRef, {
                orders: [...existingOrders, {
                    bookId,
                    bookName,
                    price,
                    addedBy: addedByEmail, // Email of the book owner
                    orderedBy: user.email, // Email of the logged-in user
                    createdAt: new Date(), // Timestamp for the order
                }],
            });
        } else {
            // If the document does not exist, create it with the new order
            await setDoc(ordersDocRef, {
                orders: [{
                    bookId,
                    bookName,
                    price,
                    addedBy: addedByEmail, // Email of the book owner
                    orderedBy: user.email, // Email of the logged-in user
                    createdAt: new Date(), // Timestamp for the order
                }],
            });
        }

        console.log("Order created successfully!");
    } catch (error) {
        console.error("Error creating order:", error.message);
        throw error; // Re-throw the error so it can be handled elsewhere
    }
};

    

    // Add Favorite Book
    const addFavoriteBook = async (book) => {
        if (!user) throw new Error("User must be logged in to add favorite books.");
        
        try {
            const favDocRef = doc(firestore, "fav", user.uid); // Use 'fav' collection
            const favDoc = await getDoc(favDocRef);

            let favoriteBooks = [];
            if (favDoc.exists()) {
                favoriteBooks = favDoc.data().books || []; // Retrieve existing favorite books
            }

            // Add the new favorite book
            favoriteBooks.push({
                bookId: book.id,  // Assuming book object has an 'id'
                name: book.name,
                price: book.price,
                imageURL: book.imageURL,
                addedby: book.addedby || "", // Ensure this is populated
                userEmail: user.email, // Store the email of the logged-in user
            });

            await setDoc(favDocRef, { books: favoriteBooks }); // Save back to Firestore
        } catch (error) {
            console.error("Error adding favorite book:", error);
            throw error;
        }
    };

    // Remove Favorite Book
    const removeFavoriteBook = async (bookId) => {
        if (!user) throw new Error("User must be logged in to remove favorite books.");
        
        try {
            const favDocRef = doc(firestore, "fav", user.uid);
            const favDoc = await getDoc(favDocRef);

            if (favDoc.exists()) {
                const favoriteBooks = favDoc.data().books || [];
                const updatedBooks = favoriteBooks.filter(book => book.bookId !== bookId); // Filter out the removed book

                await setDoc(favDocRef, { books: updatedBooks }); // Update Firestore
            }
        } catch (error) {
            console.error("Error removing favorite book:", error);
            throw error;
        }
    };

    // Get Favorite Books
    const getFavoriteBooks = async () => {
        if (!user) throw new Error("User must be logged in to get favorite books.");
        
        try {
            const favDocRef = doc(firestore, "fav", user.uid); // Use 'fav' collection
            const favDoc = await getDoc(favDocRef);
    
            if (favDoc.exists()) {
                return favDoc.data().books || []; // Return favorite books
            } else {
                return []; // No favorite books found
            }
        } catch (error) {
            console.error("Error fetching favorite books:", error);
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await firebaseAuth.signOut();
        } catch (error) {
            console.error("Error logging out:", error.message);
            throw error; 
        }
    };

    // Add a book to the cart
    const addBookToCart = async (book) => {
        if (!user) throw new Error("User must be logged in to add books to cart.");

        try {
            const cartDocRef = doc(firestore, "cart", user.uid); // Use 'cart' collection
            const cartDoc = await getDoc(cartDocRef);

            let cartBooks = [];
            if (cartDoc.exists()) {
                cartBooks = cartDoc.data().books || []; // Retrieve existing cart books
            }

            // Add the new book to the cart
            cartBooks.push({
                bookId: book.id, // Assuming book object has an 'id'
                name: book.name,
                price: book.price,
                imageURL: book.imageURL,
                addedby: book.addedby,
                userEmail: user.email,
                
            });

            await setDoc(cartDocRef, { books: cartBooks }); // Save back to Firestore
        } catch (error) {
            console.error("Error adding book to cart:", error);
            throw error;
        }
    };

    // Remove a book from the cart
    const removeBookFromCart = async (bookId) => {
        if (!user) throw new Error("User must be logged in to remove books from cart.");

        try {
            const cartDocRef = doc(firestore, "cart", user.uid);
            const cartDoc = await getDoc(cartDocRef);

            if (cartDoc.exists()) {
                const cartBooks = cartDoc.data().books || [];
                const updatedCartBooks = cartBooks.filter(book => book.bookId !== bookId); // Filter out the removed book

                await setDoc(cartDocRef, { books: updatedCartBooks }); // Update Firestore
            }
        } catch (error) {
            console.error("Error removing book from cart:", error);
            throw error;
        }
    };

    // Get books in the cart
    const getCartBooks = async () => {
        if (!user) throw new Error("User must be logged in to get cart books.");

        try {
            const cartDocRef = doc(firestore, "cart", user.uid);
            const cartDoc = await getDoc(cartDocRef);

            if (cartDoc.exists()) {
                return cartDoc.data().books || []; // Return cart books
            } else {
                return []; // No books in the cart
            }
        } catch (error) {
            console.error("Error fetching cart books:", error);
            throw error;
        }
    };

    // Fetch Orders for Logged-in User
const getUserOrders = async () => {
    if (!user) throw new Error("User must be logged in to view orders.");

    try {
        const ordersCollectionRef = collection(firestore, "orders");
        const querySnapshot = await getDocs(ordersCollectionRef);
        
        const userOrders = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.orders) {
                data.orders.forEach((order) => {
                    if (order.addedBy === user.email) {  // Match orders where `addedBy` equals the logged-in user's email
                        userOrders.push({ id: doc.id, ...order });
                    }
                });
            }
        });

        return userOrders; // Return the filtered orders
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw error;
    }
};


const cancelOrder = async (bookId) => {
    if (!user) throw new Error("User must be logged in to cancel an order.");

    try {
        const ordersCollectionRef = collection(firestore, "orders");
        const querySnapshot = await getDocs(ordersCollectionRef);

        let orderCancelled = false;

        // Loop through all orders and find the one to cancel
        for (const docSnapshot of querySnapshot.docs) {
            const data = docSnapshot.data();

            if (data.orders) {
                const updatedOrders = data.orders.filter(order => {
                    // Match the order by bookId and check if the logged-in user is either the addedBy or orderedBy
                    return !(order.bookId === bookId && (order.addedBy === user.email || order.orderedBy === user.email));
                });

                // If the number of orders is reduced, update the document
                if (updatedOrders.length !== data.orders.length) {
                    await setDoc(doc(firestore, "orders", docSnapshot.id), { orders: updatedOrders });
                    orderCancelled = true;
                }
            }
        }

        if (orderCancelled) {
            console.log("Order cancelled successfully!");
            return true;
        } else {
            throw new Error("Order not found or you are not authorized to cancel this order.");
        }

    } catch (error) {
        console.error("Error cancelling order:", error.message);
        throw error;
    }
};



// Reject an Order
const rejectOrder = async (orderId) => {
    if (!user) throw new Error("User must be logged in to reject an order.");

    try {
        const ordersCollectionRef = collection(firestore, "orders");
        const querySnapshot = await getDocs(ordersCollectionRef);

        let orderRejected = false;

        for (const docSnapshot of querySnapshot.docs) {
            const data = docSnapshot.data();

            if (data.orders) {
                const updatedOrders = data.orders.filter(order => order.id !== orderId);

                if (updatedOrders.length !== data.orders.length) {
                    await setDoc(doc(firestore, "orders", docSnapshot.id), { orders: updatedOrders });
                    orderRejected = true;
                }
            }
        }

        if (orderRejected) {
            return true;
        } else {
            throw new Error("Order not found or you are not authorized to reject this order.");
        }
    } catch (error) {
        console.error("Error rejecting order:", error.message);
        throw error;
    }
};

// Fetch order status for a list of books
const getOrderStatusForBooks = async (bookIds) => {
    try {
        const ordersCollectionRef = collection(firestore, "orders");
        const querySnapshot = await getDocs(ordersCollectionRef);

        const orderStatus = {};  // To store order status for each book

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.orders) {
                data.orders.forEach((order) => {
                    if (bookIds.includes(order.bookId)) {
                        orderStatus[order.bookId] = true; // If order exists, set it to true (purchased)
                    }
                });
            }
        });

        // Return order status for each book, defaulting to false if not found
        return bookIds.reduce((acc, bookId) => {
            acc[bookId] = orderStatus[bookId] || false;
            return acc;
        }, {});
    } catch (error) {
        console.error("Error fetching order statuses:", error.message);
        throw error;
    }
};

// Update order status in Firebase (true = purchased, false = not purchased)
const updateOrderStatus = async (bookId, status) => {
    try {
        const ordersCollectionRef = collection(firestore, "orders");
        const querySnapshot = await getDocs(ordersCollectionRef);

        // Loop through orders and update the status for the specific bookId
        for (const docSnapshot of querySnapshot.docs) {
            const data = docSnapshot.data();

            if (data.orders) {
                const updatedOrders = data.orders.map((order) => {
                    if (order.bookId === bookId) {
                        return { ...order, purchased: status }; // Update the status
                    }
                    return order;
                });

                await setDoc(doc(firestore, "orders", docSnapshot.id), { orders: updatedOrders });
            }
        }

        console.log("Order status updated successfully!");
    } catch (error) {
        console.error("Error updating order status:", error.message);
        throw error;
    }
};

// Send a chat message
const sendMessage = async (orderId, message) => {
    if (!user) throw new Error("User must be logged in to send messages.");

    try {
        const chatRef = collection(firestore, `orders/${orderId}/chat`);
        await addDoc(chatRef, {
            senderEmail: user.email,
            message,
            timestamp: new Date(), // or use Firestore's server timestamp
        });
        console.log("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

// Get chat messages for an order
const getChatMessages = async (orderId) => {
    try {
        const chatRef = collection(firestore, `orders/${orderId}/chat`);
        const querySnapshot = await getDocs(chatRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        throw error;
    }
};
// Subscribe to chat messages in real time
const subscribeToChatMessages = (orderId, callback) => {
    const chatRef = collection(firestore, `orders/${orderId}/chat`);

    return onSnapshot(chatRef, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
};



 
    return (
        <FirebaseContext.Provider value={{
            createUser,
            signIn,
            signInWithGoogle,
            createlist,
            listallbooks,
            getimg,
            createOrder,
            getUserOrders,  // Add this here
            addFavoriteBook,
            removeFavoriteBook,
            getFavoriteBooks,
            logout,
            addBookToCart,
            removeBookFromCart,
            cancelOrder,
            getCartBooks,
            rejectOrder,
            updateOrderStatus,
            getOrderStatusForBooks,
            getChatMessages,
            sendMessage,
            subscribeToChatMessages,
            isLogin,
            user
        }}>
            {props.children}
        </FirebaseContext.Provider>
        
    );
}; 

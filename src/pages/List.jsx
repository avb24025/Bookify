import React, { useState } from "react";
import { useFirebase } from "../Context/Firebase";
import styles from './List.module.css'; // Import the CSS module

const List = () => {
    const firebase = useFirebase();
    const [name, setName] = useState("");
    const [isbn, setIsbn] = useState("");
    const [price, setPrice] = useState("");
    const [coverpic, setCoverpic] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        if (!name || !isbn || !price || !coverpic) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            await firebase.createlist(name, isbn, parseFloat(price), coverpic);
            setSuccess("Book added successfully!");
            setError("");
            setName("");
            setIsbn("");
            setPrice("");
            setCoverpic(null);
        } catch (error) {
            console.error("Error adding book:", error);
            setError("Failed to add book. Please try again.");
            setSuccess("");
        }
    };

    const handleFileChange = (e) => {
        setCoverpic(e.target.files[0]);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.head}>Add a New Book</h2>
            <form onSubmit={handleOnSubmit}>
                <div className="mb-3">
                    <label htmlFor="bookName" className={`form-label ${styles.formLabel}`}>Book Name</label>
                    <input 
                        type="text" 
                        onChange={(e) => setName(e.target.value)} 
                        value={name} 
                        className={`form-control ${styles.formControl}`} 
                        id="bookName" 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="isbn" className={`form-label ${styles.formLabel}`}>Category</label>
                    <input 
                        type="text" 
                        onChange={(e) => setIsbn(e.target.value)} 
                        value={isbn} 
                        className={`form-control ${styles.formControl}`} 
                        id="isbn" 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className={`form-label ${styles.formLabel}`}>Price</label>
                    <input 
                        type="number" 
                        onChange={(e) => setPrice(e.target.value)} 
                        value={price} 
                        className={`form-control ${styles.formControl}`} 
                        id="price" 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="coverPic" className={`form-label ${styles.formLabel}`}>Cover Picture</label>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className={`form-control ${styles.formControl}`} 
                        id="coverPic" 
                        required
                    />
                </div>
                <button type="submit" className={`btn ${styles.btnPrimary}`}>Add</button>

                {error && <div className={`alert alert-danger ${styles.alert}`}>{error}</div>}
                {success && <div className={`alert alert-success ${styles.alert}`}>{success}</div>}
            </form>
        </div>
    );
};

export default List;

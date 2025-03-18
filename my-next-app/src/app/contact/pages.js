'use client';

import React, { useState } from "react";
import emailjs from "emailjs-com";
import Header from '@/app/Components/header'; // Adjusted import path for the Header component

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        emailjs
        .send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            formData,
            process.env.NEXT_PUBLIC_EMAILJS_USER_ID
        )
        .then((response) => {
            console.log("SUCCESS!", response.status, response.text);
            setIsSubmitted(true);
            setFormData({ name: "", email: "", message: "" });
        })
        .catch((err) => {
            console.error("FAILED...", err);
            setError("Something went wrong. Please try again later.");
        });
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>Contact Us</h2>
            <p>Have questions? Feel free to reach out!</p>
            {isSubmitted && <p style={{ color: "green" }}>Your message was sent successfully!</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        required
                        rows="5"
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#0070f3",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Contact;

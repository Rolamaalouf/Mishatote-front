'use client';

import React, { useState } from "react";
import emailjs from "@emailjs/browser"; // Correct EmailJS import
import Header from '@/app/Components/header'; // Ensure this path is correct

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
        };

        try {
            const response = await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                emailParams,
                process.env.NEXT_PUBLIC_EMAILJS_USER_ID
            );

            console.log("SUCCESS!", response.status, response.text);

            // If successful, send data to backend
            sendFormToBackend(formData);
        } catch (err) {
            console.error("FAILED...", err);
            setError("Something went wrong with EmailJS. Please try again later.");
        }
    };

    const sendFormToBackend = async (formData) => {
        const backendData = {
            first_name: formData.name,  // Backend expects 'first_name'
            email: formData.email,      // Matches backend field
            subject: "General Inquiry", // Set a default subject (if subject is not in the form)
            message: formData.message,  // Matches backend field
        };

        console.log("Sending data to backend:", backendData); // Debugging

        try {
            const response = await fetch('http://localhost:5000/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendData),
            });

            const data = await response.json();
            console.log("Response from backend:", data);

            if (!response.ok) {
                throw new Error(data.error || "Failed to save message.");
            }

            setIsSubmitted(true);
            setFormData({ name: "", email: "", message: "" });
        } catch (err) {
            console.error("Error sending message to backend:", err);
            setError("Something went wrong with the backend. Please try again later.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Header /> {/* Added missing Header component */}

            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-lg mb-6">Have questions? Feel free to reach out!</p>
            {isSubmitted && <p className="text-green-500 mb-4">Your message was sent successfully!</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                        className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                        className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        required
                        rows="5"
                        className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Contact;

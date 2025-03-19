'use client';

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import Header from '@/app/Components/header';

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
            first_name: formData.name,
            email: formData.email,
            subject: "General Inquiry",
            message: formData.message,
        };

        console.log("Sending data to backend:", backendData);

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
        <div className="px-6 py-12 bg-gray-100">
            {/* Header Component */}
            <Header />

            {/* Hero Banner - matching About page style */}
            <div className="bg-[#A68F7B] h-[40vh] flex items-center justify-center mt-20">
                <h1 className="text-white text-5xl sm:text-6xl font-bold text-center">Contact Us</h1>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto -mt-20 bg-white rounded-lg shadow-lg p-8 relative z-10">
                <p className="text-[#A68F7B] text-xl md:text-2xl text-center mb-8">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>

                {isSubmitted && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                        <p className="font-medium">Your message was sent successfully!</p>
                        <p>Thank you for reaching out. We'll get back to you soon.</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A68F7B]"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            required
                            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A68F7B]"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-lg font-medium text-gray-700">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Message"
                            required
                            rows="5"
                            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A68F7B]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 mt-4 bg-[#A68F7B] text-white font-semibold rounded-md hover:bg-[#8a7665] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A68F7B] focus:ring-offset-2"
                    >
                        Send Message
                    </button>
                </form>
            </div>

            {/* Contact Information */}
            <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-semibold text-[#4A8C8C]">Address</h3>
                            <p className="text-gray-600">123 Hamra Street, Beirut, Lebanon</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[#4A8C8C]">Email</h3>
                            <p className="text-gray-600">info@mishatote.com</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[#4A8C8C]">Phone</h3>
                            <p className="text-gray-600">+961 1 234 567</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#4A8C8C] p-8 rounded-lg shadow-md text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Business Hours</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-semibold">Weekdays</h3>
                            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Weekends</h3>
                            <p>Saturday: 10:00 AM - 4:00 PM</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;





import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const SubscribeForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send email through EmailJS
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,  // Service ID
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, // Template ID
        { email }, // Form data - send email address
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID    // User ID
      )
      .then(
        (response) => {
          console.log('Subscription email sent:', response);
          setStatus('You have been subscribed successfully!');
        },
        (error) => {
          console.error('Error sending email:', error);
          setStatus('There was an error. Please try again.');
        }
      );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email to subscribe"
          required
        />
        <button type="submit">Subscribe</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SubscribeForm;

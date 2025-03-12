import { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Adjust path as necessary
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(''); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const userData = await login({ email, password });
        console.log('User Data:', userData); // Log the returned user data

        // Check if user role is 'customer'
        if (userData && userData.role === 'customer') {
            console.log('User has customer access');
            router.push('/'); // Redirect to home if the user is a customer
        } else {
            console.log('User does not have customer access');
            setError('You do not have permission to access this application.');
        }
    } catch (err) {
        console.error('Login failed:', err);
        setError('Login failed. Please check your credentials and try again.');
    }
};

  
  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
        <div className="mb-4">
          <label className="block mb-1" htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <button type="submit" className="bg-[#4A8C8C] text-white py-2 px-4 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

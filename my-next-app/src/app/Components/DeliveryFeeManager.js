'use client';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
 import { FaEdit } from 'react-icons/fa';

const DeliveryFeeManager = () => {
 

  const [fee, setFee] = useState('');
  const [newFee, setNewFee] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchFee = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shipping`, {
        withCredentials: true,
      });
      setFee(res.data.delivery_fee);
      setNewFee(res.data.delivery_fee);
    } catch (error) {
      toast.error('Failed to fetch delivery fee');
    } finally {
      setLoading(false);
    }
  };

  const updateFee = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping`,
        { delivery_fee: parseFloat(newFee) },
        {
          withCredentials: true,
          
        }
      );
      setFee(newFee);
      toast.success('Delivery fee updated!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    }
  };

  useEffect(() => {
    fetchFee();
  }, []);

  if (loading) return <p className="text-gray-500">Loading delivery fee...</p>;

  return (
    <div className="bg-white p-4 mb-6 shadow rounded-lg max-w-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Delivery Fee</h2>
        {  (
          <button onClick={() => setIsEditing(!isEditing)} className="text-yellow-700 hover:text-yellow-500">
           <FaEdit className="h-5 w-5" />
          </button>
        )}
      </div>

      {!isEditing ? (
        <p className="mt-2 text-gray-700">Current Fee: <strong>${fee}</strong></p>
      ) : (
        <div className="mt-2">
          <input
            type="number"
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={updateFee}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryFeeManager;

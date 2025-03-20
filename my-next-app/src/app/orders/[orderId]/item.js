// app/orders/[orderId]/items.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const OrderItemsPage = () => {
    const router = useRouter();
    const { orderId } = router.query; // Get the orderId from the URL

    const [orderItems, setOrderItems] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!orderId) return; // Don't fetch if the orderId is not yet available

        const getOrderItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/items`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setOrderItems(response.data);
                } else {
                    setError(`Unexpected response status: ${response.status}`);
                }
            } catch (err) {
                console.error('Error fetching order items:', err);
                setError('Unable to get order items');
            }
        };

        getOrderItems();
    }, [orderId]); // Re-run the effect when orderId changes

    return (
        <div>
            <h1>Order Items for Order {orderId}</h1>
            {error && <p>{error}</p>}
            {orderItems.length === 0 ? (
                <p>No items found for this order.</p>
            ) : (
                <ul>
                    {orderItems.map((item) => (
                        <li key={item.id}>
                            <p>Product: {item.product?.name}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.product?.price}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderItemsPage;

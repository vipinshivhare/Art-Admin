import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from "react-toastify"
import axios from "axios"

const Orders = ({ url }) => {

    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(url + "/api/order/list");
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error("Failed to fetch orders");
            }
        } catch (error) {
            toast.error("Server Error");
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            const apiUrl = status === "Accepted"
                ? `${url}/api/order/accept`
                : status === "Not Accepted"
                    ? `${url}/api/order/not-accept`
                    : null;

            if (!apiUrl) return;

            const response = await axios.post(apiUrl, { orderId });
            if (response.data.success) {
                toast.success(`Order ${status}`);
                fetchAllOrders();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Server Error");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className='orders-table-wrapper'>
            <h2>All Orders</h2>
            <div className="table-responsive">
                <table className='orders-table'>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>User ID</th>
                            <th>Amount (₹)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.customerName || "Unknown"}</td>
                                <td>{order.userId}</td>
                                <td>{order.amount}</td>
                                <td>
                                    <select
                                        className="status-dropdown"
                                        value={order.status || "Pending"}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Not Accepted">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;

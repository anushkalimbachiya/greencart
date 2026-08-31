import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast';

const Oder = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.post("/api/order/seller");
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleStatusChange = async (event, orderId) => {
        const status = event.target.value;
        try {
            const { data } = await axios.post("/api/order/status", { orderId, status });
            if (data.success) {
                toast.success(data.message);
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-xl font-semibold">Orders List</h2>
                {orders.length > 0 ? orders.map((order, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300 bg-white shadow-sm">
                        <div className="flex gap-5">
                            <img className="w-12 h-12 object-contain" src={assets.box_icon} alt="boxIcon" />
                            <div className="flex flex-col">
                                {order.items.map((item, id) => (
                                    <p key={id} className="font-medium text-gray-800">
                                        {item.product.name}{""}
                                        <span className="text-primary font-bold">x {item.quantity}</span>
                                    </p>
                                ))}
                                <div className="mt-2 text-sm text-gray-500">
                                    <p className='font-semibold text-gray-800'>{order.address.firstName} {order.address.lastName}</p>
                                    <p>{order.address.street}, {order.address.city}</p>
                                    <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                                    <p>{order.address.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-start md:items-end gap-1">
                            <p className="font-bold text-lg text-primary">{currency}{order.amount}</p>
                            <div className="text-sm text-gray-500">
                                <p><span className="font-medium text-gray-700">Method:</span> {order.paymenttype}</p>
                                <p><span className="font-medium text-gray-700">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p><span className="font-medium text-gray-700">Payment:</span> {order.ispaid ? <span className="text-green-600 font-semibold">Paid</span> : <span className="text-orange-500 font-semibold">Pending</span>}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                           <select onChange={(e) => handleStatusChange(e, order._id)} value={order.status} className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-gray-50 outline-none focus:border-primary">
                                <option value="Order Placed">Order Placed</option>
                                <option value="Packing">Packing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                           </select>
                        </div>
                    </div>
                )) : (
                    <p className="text-gray-500">No orders found.</p>
                )}
            </div>
        </div>
    )
}

export default Oder
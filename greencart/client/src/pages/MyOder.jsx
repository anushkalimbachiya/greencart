import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

const MyOder = () => {
    const [myorders, setMyOrders] = useState([]);
    const { currency, user, navigate, orders, fetchOrders } = useAppContext();

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user])

    useEffect(() => {
        setMyOrders(orders);
    }, [orders])

    useEffect(() => {
        if (!user) {
            navigate("/")
        }
    }, [user, navigate])

    return (
        <div className='py-12'>
            <div className='mb-10'>
                <h2 className='text-xl md:text-2xl font-medium border-b-2 border-primary w-fit pb-1'>MY ORDERS</h2>
            </div>

            <div className='flex flex-col gap-8'>
                {myorders && myorders.length > 0 ? (
                    myorders.map((order, index) => (
                        <div key={index} className='border border-gray-300 rounded-lg p-5 md:p-8 shadow-sm'>
                            {/* Order Header Grid */}
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-6 pb-4 border-b border-gray-100'>
                                <p><span className='font-medium text-gray-500'>Order ID :</span> {order._id}</p>
                                <p><span className='font-medium text-gray-500'>Payment :</span> {order.paymenttype}</p>
                                <p><span className='font-medium text-gray-500'>Total Amount :</span> {currency}{order.amount}</p>
                            </div>

                            {/* Order Items List */}
                            <div className='flex flex-col gap-8'>
                                {order.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
                                        {/* Image and Name Section */}
                                        <div className='flex items-center gap-6 md:w-2/5'>
                                            <div className='w-24 h-24 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-100'>
                                                {item.product && item.product.image && (
                                                    <img src={item.product.image[0]} alt={item.product.name} className='w-20 h-20 object-contain p-2' />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className='text-lg font-bold text-gray-800'>{item.product ? item.product.name : 'Product Deleted'}</h3>
                                                <p className='text-sm text-gray-500'>Category: {item.product ? item.product.category : 'N/A'}</p>
                                            </div>
                                        </div>

                                        {/* Meta Section (Quantity, Status, Date) */}
                                        <div className='flex flex-col gap-1 md:w-1/5'>
                                            <p className='text-sm text-gray-500 font-medium'>Quantity: {item.quantity}</p>
                                            <p className='text-sm text-gray-500 font-medium'>Status: <span className='text-primary'>{order.status}</span></p>
                                            <p className='text-sm text-gray-500 font-medium'>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>

                                        {/* Price Section */}
                                        <div className='md:w-1/5 md:text-right'>
                                            <p className='text-xl font-bold text-primary'>Amount: {currency}{item.product ? item.product.offerPrice : 0}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Track Order Button */}
                            <div className='mt-6 pt-4 border-t border-gray-100 flex justify-end'>
                                <button
                                    onClick={() => navigate(`/order-tracking/${order._id}`)}
                                    className='px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition active:scale-95'
                                >
                                    Track Order
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200'>
                        <span className='text-6xl mb-4'>📦</span>
                        <h2 className='text-xl font-semibold text-gray-800'>No orders found</h2>
                        <p className='text-gray-500 mt-2'>Looks like you haven't placed any orders yet.</p>
                        <button onClick={() => navigate('/products')} className='mt-6 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform'>
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyOder
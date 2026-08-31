import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const Cart = () => {
    const { products, cartItems, setCartItems, addToCart, removeFromCart, getTotalCartAmount, currency, navigate, address: contextAddress, axios, fetchOrders, user } = useAppContext();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const getUserAddresses = async () => {
        try {
            const { data } = await axios.post('/api/address/get');
            if (data.success) {
                setUserAddresses(data.address);
                if (data.address.length > 0) {
                    setSelectedAddress(data.address[0]);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (user) {
            getUserAddresses();
        }
    }, [user]);

    const cartProducts = Object.keys(cartItems)
        .filter(id => cartItems[id] > 0)
        .map(id => ({ product: products.find(p => p._id === id), qty: cartItems[id] }))
        .filter(item => item.product);

    const subtotal = getTotalCartAmount();
    const tax = Math.floor(subtotal * 0.02 * 100) / 100;
    const total = Math.floor((subtotal + tax) * 100) / 100;

    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error("Please login to place order");
            return;
        }

        const finalAddress = selectedAddress || contextAddress;

        if (!finalAddress) {
            toast.error("Please add a delivery address");
            navigate('/add-address');
            return;
        }

        try {
            const orderItems = cartProducts.map(item => ({
                product: item.product._id,
                quantity: item.qty
            }));

            if (paymentMethod === 'cod') {
                const { data } = await axios.post('/api/order/cod', { 
                    items: orderItems, 
                    address: finalAddress, 
                    paymentType: 'COD' 
                });

                if (data.success) {
                    setCartItems({});
                    await fetchOrders();
                    navigate(`/order-tracking/${data.orderId}?type=cod`);
                    scrollTo(0, 0);
                } else {
                    toast.error(data.message);
                }
            } else {
                // Stripe payment
                const { data } = await axios.post('/api/order/stripe', { 
                    items: orderItems, 
                    address: finalAddress, 
                    paymentType: 'Online' 
                });

                if (data.success) {
                    setCartItems({});
                    window.location.replace(data.session_url);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='mt-10 pb-20'>

            {/* Header */}
            <h1 className='text-2xl font-medium mb-6'>
                Shopping Cart{' '}
                <span className='text-primary text-base font-normal'>
                    {cartProducts.length} Items
                </span>
            </h1>

            {cartProducts.length === 0 ? (
                <div className='flex flex-col items-center justify-center mt-20 gap-4 text-gray-400'>
                    <img src={assets.nav_cart_icon} alt='empty cart' className='w-20 opacity-30' />
                    <p className='text-xl'>Your cart is empty</p>
                    <button onClick={() => navigate('/products')} className='px-8 py-2 bg-primary text-white rounded hover:bg-primary/90 transition'>
                        Shop Now
                    </button>
                </div>
            ) : (
                <div className='flex flex-col lg:flex-row gap-8'>

                    {/* Left — Cart Table */}
                    <div className='flex-1'>
                        {/* Table Header */}
                        <div className='grid grid-cols-[1fr_auto_auto] border-b border-gray-200 pb-2 mb-2 text-sm text-gray-500'>
                            <span>Product Details</span>
                            <span className='text-center pr-16'>Subtotal</span>
                            <span className='text-center'>Action</span>
                        </div>

                        {/* Cart Rows */}
                        {cartProducts.map(({ product, qty }) => (
                            <div key={product._id} className='grid grid-cols-[1fr_auto_auto] items-center border-b border-gray-100 py-4'>
                                {/* Product Info */}
                                <div className='flex items-center gap-4'>
                                    <div
                                        onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0); }}
                                        className='cursor-pointer w-20 h-20 border border-gray-200 rounded flex items-center justify-center overflow-hidden shrink-0 bg-gray-50'
                                    >
                                        <img src={product.image[0]} alt={product.name} className='max-h-full object-contain' />
                                    </div>
                                    <div>
                                        <p className='font-medium text-gray-800 text-sm'>{product.name}</p>
                                        <p className='text-gray-400 text-xs mt-0.5'>Weight: N/A</p>
                                        <div className='flex items-center gap-3 mt-1'>
                                            <div className='flex items-center border border-gray-200 rounded'>
                                                <button onClick={() => removeFromCart(product._id)} className='px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition'>-</button>
                                                <span className='px-4 text-sm font-medium'>{qty}</span>
                                                <button onClick={() => addToCart(product._id)} className='px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition'>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Subtotal */}
                                <span className='text-sm font-medium text-gray-700 pr-16'>
                                    {currency}{product.offerPrice * qty}
                                </span>

                                {/* Remove */}
                                <button
                                    onClick={() => {
                                        for (let i = 0; i < qty; i++) removeFromCart(product._id);
                                    }}
                                    className='text-red-400 hover:text-red-600 transition text-xl'
                                    title='Remove item'
                                >
                                    ⊗
                                </button>
                            </div>
                        ))}

                        {/* Continue Shopping */}
                        <button
                            onClick={() => { navigate('/products'); scrollTo(0, 0); }}
                            className='mt-6 flex items-center gap-1 text-primary text-sm hover:underline'
                        >
                            ← Continue Shopping
                        </button>
                    </div>

                    {/* Right — Order Summary */}
                    <div className='w-full lg:w-72 bg-gray-50 border border-gray-200 rounded-md p-5 h-fit'>
                        <p className='text-lg font-semibold mb-4'>Order Summary</p>

                        {/* Delivery Address */}
                        <div className='flex justify-between items-center mb-1'>
                            <p className='text-xs font-semibold text-gray-700 uppercase tracking-wide'>Delivery Address</p>
                            <button onClick={() => navigate('/add-address')} className='text-[10px] text-primary hover:underline font-medium'>
                                {selectedAddress || contextAddress ? 'Change' : 'Add'}
                            </button>
                        </div>
                        
                        <div className='mb-4'>
                            {userAddresses.length > 0 ? (
                                <select 
                                    onChange={(e) => setSelectedAddress(userAddresses[e.target.value])}
                                    className='w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 bg-white outline-none focus:border-primary'
                                >
                                    {userAddresses.map((addr, idx) => (
                                        <option key={idx} value={idx}>
                                            {addr.firstName} {addr.lastName} - {addr.city}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className='text-xs text-gray-600 bg-white border border-gray-200 p-2 rounded'>
                                    {contextAddress ? (
                                        <>
                                            <p className='font-medium'>{contextAddress.firstName} {contextAddress.lastName}</p>
                                            <p className='text-gray-500 line-clamp-1'>{contextAddress.street}, {contextAddress.city}</p>
                                        </>
                                    ) : (
                                        <p className='text-gray-400 italic'>No address selected</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <p className='text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2'>Payment Method</p>
                        <select
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                            className='w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white mb-5 outline-none focus:border-primary'
                        >
                            <option value='cod'>Cash On Delivery</option>
                            <option value='online'>Online Payment</option>
                        </select>

                        {/* Price Breakdown */}
                        <div className='flex justify-between text-sm text-gray-600 mb-1'>
                            <span>Price</span>
                            <span>{currency}{subtotal}</span>
                        </div>
                        <div className='flex justify-between text-sm text-gray-600 mb-1'>
                            <span>Shipping Fee</span>
                            <span className='text-primary font-medium'>Free</span>
                        </div>
                        <div className='flex justify-between text-sm text-gray-600 mb-3'>
                            <span>Tax (2%)</span>
                            <span>{currency}{tax}</span>
                        </div>

                        <div className='border-t border-gray-300 pt-3 flex justify-between font-semibold text-gray-800 text-base mb-4'>
                            <span>Total Amount:</span>
                            <span>{currency}{total}</span>
                        </div>

                        <button onClick={handlePlaceOrder} className='w-full py-3 bg-primary text-white rounded hover:bg-primary/90 transition font-medium'>
                            {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Checkout'}
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Cart

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const TRACKING_STEPS = [
    { key: 'order placed',  label: 'Order Placed',    icon: '🛒', desc: 'We have received your order.' },
    { key: 'processing',    label: 'Processing',       icon: '⚙️', desc: 'Your order is being prepared.' },
    { key: 'shipped',       label: 'Shipped',          icon: '🚚', desc: 'Your order is on its way.' },
    { key: 'out for delivery', label: 'Out for Delivery', icon: '📦', desc: 'Almost there!' },
    { key: 'delivered',     label: 'Delivered',        icon: '✅', desc: 'Enjoy your order!' },
];

const OrderTracking = () => {
    const { orderId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get('success');
    const paymentType = searchParams.get('type'); // 'cod' | 'stripe'

    const { axios, currency, user, navigate } = useAppContext();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    // Fetch order details by ID
    const fetchOrder = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/order/user');
            if (data.success) {
                const found = data.orders.find(o => o._id === orderId);
                setOrder(found || null);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Verify Stripe session and mark order as paid
    const verifyStripe = async () => {
        try {
            const { data } = await axios.post('/api/order/verifyStripe', { orderId, success });
            if (data.success) {
                setVerified(true);
                toast.success('Payment confirmed!');
            } else {
                toast.error(data.message || 'Payment verification failed.');
                navigate('/my-orders');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSearchParams({}); // clean URL
        }
    };

    useEffect(() => {
        if (!user) { navigate('/'); return; }
        const init = async () => {
            if (success === 'true' && paymentType === 'stripe') {
                await verifyStripe();
            }
            await fetchOrder();
        };
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Active step index
    const activeStep = order
        ? TRACKING_STEPS.findIndex(s => s.key === order.status?.toLowerCase())
        : 0;
    const stepIndex = activeStep === -1 ? 0 : activeStep;

    if (!user) return null;

    if (loading) return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='flex flex-col items-center gap-4'>
                <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                <p className='text-gray-500 font-medium'>Loading your order…</p>
            </div>
        </div>
    );

    if (!order) return (
        <div className='min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500'>
            <span className='text-5xl'>😕</span>
            <p className='text-lg font-semibold'>Order not found.</p>
            <button onClick={() => navigate('/my-orders')} className='mt-2 bg-primary text-white px-6 py-2 rounded-xl'>View My Orders</button>
        </div>
    );

    return (
        <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 md:px-16'>

            {/* ── Header ── */}
            <div className='max-w-3xl mx-auto mb-10 text-center'>
                <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-4xl mb-4 shadow-md'>
                    🎉
                </div>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
                    {order.ispaid ? 'Payment Successful!' : 'Order Confirmed!'}
                </h1>
                <p className='text-gray-500 mt-2'>
                    Thank you for shopping with <span className='text-primary font-semibold'>GreenCart</span>. Your fresh groceries are on their way!
                </p>
            </div>

            <div className='max-w-3xl mx-auto flex flex-col gap-6'>

                {/* ── Order Meta Card ── */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    <InfoChip label='Order ID' value={`#${order._id.slice(-8).toUpperCase()}`} />
                    <InfoChip label='Payment Mode' value={order.paymenttype} highlight />
                    <InfoChip label='Total Amount' value={`${currency}${order.amount}`} highlight />
                    <InfoChip label='Status' value={order.status} />
                </div>

                {/* ── Visual Order Tracker ── */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                    <h2 className='text-lg font-semibold text-gray-700 mb-6'>📍 Order Progress</h2>
                    <div className='relative flex items-start gap-0'>
                        {TRACKING_STEPS.map((step, idx) => {
                            const isDone = idx <= stepIndex;
                            const isActive = idx === stepIndex;
                            return (
                                <div key={step.key} className='flex-1 flex flex-col items-center relative'>
                                    {/* Connector line */}
                                    {idx < TRACKING_STEPS.length - 1 && (
                                        <div className={`absolute top-5 left-1/2 w-full h-1 z-0 transition-all duration-500 ${idx < stepIndex ? 'bg-primary' : 'bg-gray-200'}`} />
                                    )}
                                    {/* Circle */}
                                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-500 shadow
                                        ${isActive ? 'border-primary bg-primary text-white scale-110 shadow-primary/30 shadow-md' :
                                          isDone ? 'border-primary bg-green-50 text-primary' :
                                          'border-gray-200 bg-white text-gray-400'}`}>
                                        {step.icon}
                                    </div>
                                    {/* Label */}
                                    <p className={`mt-2 text-[10px] sm:text-xs font-medium text-center leading-tight px-1
                                        ${isActive ? 'text-primary font-bold' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
                                        {step.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <p className='mt-6 text-center text-sm text-gray-500 italic'>
                        {TRACKING_STEPS[stepIndex]?.desc}
                    </p>
                </div>

                {/* ── Order Items ── */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                    <h2 className='text-lg font-semibold text-gray-700 mb-4'>🛍️ Items Ordered</h2>
                    <div className='flex flex-col divide-y divide-gray-100'>
                        {order.items.map((item, idx) => (
                            <div key={idx} className='flex items-center gap-4 py-4'>
                                {/* Product Image */}
                                <div className='w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                                    {item.product && item.product.image?.[0]
                                        ? <img src={item.product.image[0]} alt={item.product.name} className='w-full h-full object-contain p-1' />
                                        : <span className='text-2xl'>📦</span>
                                    }
                                </div>
                                {/* Name + category */}
                                <div className='flex-1 min-w-0'>
                                    <p className='font-semibold text-gray-800 truncate'>
                                        {item.product ? item.product.name : 'Product Removed'}
                                    </p>
                                    {item.product?.category && (
                                        <p className='text-xs text-gray-400 mt-0.5'>{item.product.category}</p>
                                    )}
                                    <p className='text-xs text-gray-500 mt-1'>Qty: <span className='font-medium'>{item.quantity}</span></p>
                                </div>
                                {/* Price */}
                                <div className='text-right flex-shrink-0'>
                                    <p className='font-bold text-primary text-sm'>
                                        {currency}{item.product ? item.product.offerPrice * item.quantity : '—'}
                                    </p>
                                    {item.product && (
                                        <p className='text-[10px] text-gray-400'>{currency}{item.product.offerPrice} each</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Total row */}
                    <div className='flex justify-between items-center pt-4 border-t border-gray-100 mt-2'>
                        <span className='font-semibold text-gray-700'>Total (incl. 2% tax)</span>
                        <span className='text-xl font-bold text-primary'>{currency}{order.amount}</span>
                    </div>
                </div>

                {/* ── Delivery Address ── */}
                {order.address && (
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
                        <h2 className='text-lg font-semibold text-gray-700 mb-3'>📬 Delivery Address</h2>
                        <p className='text-gray-700 font-medium'>{order.address.firstName} {order.address.lastName}</p>
                        <p className='text-gray-500 text-sm mt-1'>{order.address.street}, {order.address.city}, {order.address.state} — {order.address.zipcode}</p>
                        <p className='text-gray-500 text-sm'>{order.address.country}</p>
                        {order.address.phone && <p className='text-gray-500 text-sm'>📞 {order.address.phone}</p>}
                    </div>
                )}

                {/* ── Action Buttons ── */}
                <div className='flex flex-col sm:flex-row gap-3'>
                    <button
                        onClick={() => navigate('/my-orders')}
                        className='flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition shadow-md hover:shadow-lg active:scale-95'
                    >
                        View All Orders
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className='flex-1 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-green-50 transition active:scale-95'
                    >
                        Continue Shopping
                    </button>
                </div>

            </div>
        </div>
    );
};

// Small reusable label-value chip
const InfoChip = ({ label, value, highlight }) => (
    <div className='flex flex-col gap-0.5'>
        <span className='text-[10px] uppercase tracking-widest text-gray-400 font-medium'>{label}</span>
        <span className={`text-sm font-bold ${highlight ? 'text-primary' : 'text-gray-800'} break-all`}>{value}</span>
    </div>
);

export default OrderTracking;

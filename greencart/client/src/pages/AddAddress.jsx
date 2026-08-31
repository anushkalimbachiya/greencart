import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const AddAddress = () => {
    const { axios, user, navigate, setAddress } = useAppContext()

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (user) {
                const { data } = await axios.post('/api/address/add', { ...formData, zipcode: Number(formData.zipCode) });
                if (data.success) {
                    toast.success(data.message)
                    setAddress(formData)
                    navigate('/cart')
                } else {
                    toast.error(data.message)
                }
            } else {
                setAddress(formData)
                navigate('/cart')
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    return (
        <div className='mt-16 pb-16'>
            <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className='font-semibold text-primary'>Address</span></p>

            <div className='flex flex-col md:flex-row items-center justify-between gap-10 mt-10'>
                <form onSubmit={onSubmitHandler} className='w-full md:w-1/2 flex flex-col gap-4'>
                    <div className='flex gap-4'>
                        <input name='firstName' onChange={onChangeHandler} value={formData.firstName} className='border border-gray-300 rounded px-4 py-2 w-full outline-none' type="text" placeholder='First Name' required />
                        <input name='lastName' onChange={onChangeHandler} value={formData.lastName} className='border border-gray-300 rounded px-4 py-2 w-full outline-none' type="text" placeholder='Last Name' required />
                    </div>
                    <input name='email' onChange={onChangeHandler} value={formData.email} className='border border-gray-300 rounded px-4 py-2 w-full outline-none' type="email" placeholder='Email address' required />
                    <input name='street' onChange={onChangeHandler} value={formData.street} className='border border-gray-300 rounded px-4 py-2 w-full outline-none' type="text" placeholder='Street' required />
                    <div className='flex gap-4'>
                        <input name='city' onChange={onChangeHandler} value={formData.city} className='border border-gray-300 rounded px-4 py-2 w-full outline-none' type="text" placeholder='City' required />
                        <input name='state' onChange={onChangeHandler} value={formData.state} className='border border-gray-300 rounded px-4 py-2 w-full outline-none' type="text" placeholder='State' required />
                    </div>
                    <div className='flex gap-4'>
                        <input name='zipCode' onChange={onChangeHandler} value={formData.zipCode} className='border border-gray-300 rounded px-4 py-2 w-full outline-none' type="text" placeholder='Zip code' required />
                        <input name='country' onChange={onChangeHandler} value={formData.country} className='border border-gray-300 rounded px-4 py-2 w-full outline-none' type="text" placeholder='Country' required />
                    </div>
                    <input name='phone' onChange={onChangeHandler} value={formData.phone} className='border border-gray-300 rounded px-4 py-2 w-full outline-none' type="number" placeholder='Phone' required />

                    <button type='submit' className='mt-4 px-10 py-3 bg-primary text-white rounded font-medium uppercase'>
                        Save Address
                    </button>
                </form>

                <div className='hidden md:block w-1/2'>
                    <img className='w-full max-w-sm ml-auto' src={assets.add_address_iamge} alt="Add Address" />
                </div>
            </div>
        </div>
    )
}

export default AddAddress
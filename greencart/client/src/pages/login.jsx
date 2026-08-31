import React from 'react'

const Login = () => {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="border p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 text-center">Login</h2>

        <input 
          type="email" 
          placeholder="Email" 
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input 
          type="password" 
          placeholder="Password" 
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Login
        </button>
      </div>
    </div>
  )
}

export default Login
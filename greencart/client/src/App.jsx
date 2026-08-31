import React from "react";
import Navbar from "./components/Navbar.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import AllProduct from "./pages/AllProduct.jsx";
import ProdectDetails from "./pages/ProdectDetails.jsx";
import Cart from "./pages/Cart.jsx";
import AddAddress from "./pages/AddAddress.jsx";
import MyOder from "./pages/MyOder.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";
import SellerLogin from "./components/Seller/sellerLogin.jsx";
import Sellerlayout from "./pages/Seller/Sellerlayout.jsx";
import Addproduct from "./pages/Seller/Addproduct.jsx";
import ProductList from "./pages/Seller/ProductList.jsx";
import Oder from "./pages/Seller/Oder.jsx";

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, setShowUserLogin, isSeller } = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>

      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login setShowLogin={setShowUserLogin} /> : null}
      <Toaster />
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"} `} >
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/products" element={<AllProduct />} />
          <Route path="/products/:category" element={<AllProduct />} />
          <Route path="/products/:category/:id" element={<ProdectDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOder />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="/seller" element={isSeller ? <Sellerlayout /> : <SellerLogin />} >
            <Route index element={isSeller ? <Addproduct /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Oder />} />
          </Route>
        </Routes>

      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate()
    const [user, setuser] = useState(null)
    const [isSeller, setSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setproducts] = useState([])

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart && savedCart !== "undefined") {
            try { return JSON.parse(savedCart); } catch (e) {}
        }
        return {};
    })
    const [searchQuery, setSearchQuery] = useState("")
    const [orders, setOrders] = useState([])
    const [address, setAddress] = useState(() => {
        const savedAddress = localStorage.getItem('address');
        if (savedAddress && savedAddress !== "undefined") {
            try { return JSON.parse(savedAddress); } catch (e) {}
        }
        return null;
    })

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems])

    useEffect(() => {
        localStorage.setItem('address', JSON.stringify(address));
    }, [address])

    // fetch user address
    const fetchAddress = useCallback(async () => {
        try {
            const { data } = await axios.post("/api/address/get");
            if (data.success && data.address.length > 0) {
                setAddress(data.address[0]);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    // fetch user data
    const getUserData = useCallback(async () => {
        try {
            const { data } = await axios.post("/api/user/is-auth");
            if (data.success) {
                setuser(data.user);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    // fetch user orders
    const fetchOrders = useCallback(async () => {
        try {
            const { data } = await axios.post("/api/order/user");
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    // fetch user auth status and cart
    const fetchUser = useCallback(async () => {
        try {
            const { data } = await axios.post("/api/user/is-auth");
            if (data.success) {
                setuser(data.user);
                setCartItems(data.user.cartData || {});
                fetchAddress();
            } else {
                setuser(null);
            }
        } catch (error) {
            console.log(error);
        }
    }, [fetchAddress]);

    // fetch products
    const fetchProducts = useCallback(async () => {
       try {
        const { data } = await axios.get('/api/product/list')
        if(data.success){
            setproducts(data.products);
        } else {
            toast.error(data.message);
        }
       } catch (error) {
        toast.error(error.message);
       }
    }, []);

    // fetch seller status
    const fetchSellerStatus = useCallback(async () => {
        try {
            const { data } = await axios.post("/api/seller/is-auth");
            setSeller(!!data.success);
        } catch (error) {
            setSeller(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchSellerStatus();
        fetchProducts();
        fetchUser();
        fetchOrders();
    }, [fetchSellerStatus, fetchProducts, fetchUser, fetchOrders])

    // Logout
    const logout = async () => {
        try {
            const { data } = await axios.post("/api/user/logout");
            if (data.success) {
                setuser(null);
                setSeller(false);
                setOrders([]);
                toast.success(data.message);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // add to cart
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = (cartData[itemId] || 0) + 1;
        setCartItems(cartData);
        toast.success("Added to cart");
    }

    // remove from cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] <= 0) {
                delete cartData[itemId];
            }
            setCartItems(cartData);
            toast.success("Removed from cart");
        }
    }

    // update cart in database when cartItems changes
    useEffect(() => {
        const updateCartDB = async () => {
            try {
                await axios.post("/api/cart/update-cart", { cartItems });
            } catch (error) {
                console.log("Cart sync error:", error.message);
            }
        }
        if (user) {
            updateCartDB();
        }
    }, [cartItems, user])

    const getCartItemCount = () => {
        return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            let itemInfo = products.find((product) => product._id === item);
            if (itemInfo && cartItems[item] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[item];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    const value = { 
        navigate, user, setuser, setSeller, isSeller, showUserLogin, setShowUserLogin, 
        products, currency, addToCart, removeFromCart, cartItems, setCartItems, 
        searchQuery, setSearchQuery, getCartItemCount, getTotalCartAmount, 
        orders, setOrders, address, setAddress, axios, backendUrl, logout, 
        fetchOrders, getUserData, fetchProducts 
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context;
}
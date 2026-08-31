import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.json({success:false, message:"Missing Details"});
        }  
        const existingUser = await user.findOne({email}); 
    
        if(existingUser){
            return res.json({success:false, message:"User already exists"});
        }  
         const hashedPassword = await bcrypt.hash(password,10); 
             
         const newUser = await user.create({name,email,password:hashedPassword})

         const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET,{expiresIn:"7d"} );
        
        res.cookie('token', token,{
            httpOnly : true,// prevent Javascript to accesss cookie
            secure: process.env.NODE_ENV === 'production',// Use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',// CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expire time
        })
          
        return res.json({success:true, user: {email: newUser.email, name: newUser.name}});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

//Login User : /api/user/login

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.json({success:false, message:"Email and password are required"});
        }

        const existingUser = await user.findOne({email});

        if(!existingUser){
            return res.json({success:false, message:"Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if(!isMatch){
            return res.json({success:false, message:"Invalid email or password"});
        }

        const token = jwt.sign({id:existingUser._id}, process.env.JWT_SECRET,{expiresIn:"7d"} );
        
        res.cookie('token', token,{
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 ,
        })
          
        return res.json({success:true, user: {email: existingUser.email, name: existingUser.name}});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}



// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await user.findById(userId).select('-password')
        return res.json({success:true, user: userData})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}


//Logout User : /api/user/logout

export const logout = async (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({success: true, message: "Logged Out"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

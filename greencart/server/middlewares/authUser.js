import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    const { token } = req.cookies;
    
    if(!token){
        return res.json({success:false, message:"Not Authorized"});

    }

    try{
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecoded.id){
            req.body = req.body || {};
            req.body.userId = tokenDecoded.id;
        }else{
            return res.json({success:false, message:"Not Authorized"});
        }
        next();

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export default authUser;

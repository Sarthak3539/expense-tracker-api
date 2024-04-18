import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
config()
export async function incrept(data){
    const token=await jwt.sign({email:data.email,password:data.password,name:data.name},process.env.JWT_TOKEN,{
        algorithm: 'HS256',
        expiresIn: '5d',
        })
    return token
}

export function verifyToken(req, res, next) {
    const token = req.header('jwt');
    console.log(token)
    next();
    // if (!token) return res.status(401).json({ error: 'Access denied' });
    // try {
    //  const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    //  console.log(decoded);
    //  next();
    //  } catch (error) {
    //  res.status(401).json({ error: 'Invalid token' });
    //  }
};

import {connect} from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connection=async()=>{
    try{
        await connect(process.env.MONGO_URL)
        .then(()=>{
            console.log(`\x1b[3m   ⚡ Db is running\x1b[0m`);
        })
        .catch((error)=>{
            console.log(error.message)
        })
    }
       
    catch(error){
        console.log(error)
    }
}
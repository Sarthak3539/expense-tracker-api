import {Schema,model} from 'mongoose'


const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    expensehandler:{

        totalIncome:{
            type:Number,
            required:true,
            default:0
        },
        totalExpense:{
            type:Number,
            required:true,
            default:0
        }
    }

})

export const User=model('User',userSchema)


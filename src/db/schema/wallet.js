import {Schema,model} from 'mongoose'


const walletSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        required:true
    },
    income_this_month:{
        type:Number,
        default:0
    },
    expense_this_month:{
        type:Number,
        default:0
    }
    // income this month & expence this month
})


export const Wallet=model('wallet',walletSchema)



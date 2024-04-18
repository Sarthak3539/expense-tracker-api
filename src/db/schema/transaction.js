import {Schema,model, trusted} from 'mongoose'


const transactionSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    expense:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required: true,
    },
    category:{
        type:String,
        required:true
    },
    title:{
        type:String,
    },
    mode:{
        type:Boolean,
        required:true// true -> income  false->expence
    },

    wallet_id:{
     type:String, // object.id 
     required:true
    }
})

export const Transaction=model('transaction',transactionSchema)

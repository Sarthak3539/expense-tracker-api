import express from "express"
import dotenv from "dotenv"
import { auth } from "./src/route/auth.js";
import { transaction } from "./src/route/transation.js";
import { wallet } from "./src/route/wallet.js";
import {connection} from "./src/db/connect.js"
import { expensehandler } from "./src/route/expensehandler.js";
import cors from 'cors'
dotenv.config()
const app=express() 
console.clear()
import morgan from 'morgan'
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false,
  })
)
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

  app.use(cors({
    origin:'*'
  }))
  
  console.clear();

app.use('/auth',auth);
app.use('/transation',transaction)
app.use('/wallet',wallet)
app.use('/expensehandler',expensehandler)

// app.get('/:id', function (req, res) {
//   console.log(req.params['id']);
//   res.send();
// })

const server = async () => {
    try {
      process.stdout.write(`\x1b[2J`); //clear screen 
      process.stdout.write(`\x1b[0f`); //set cursor to 0,0
      console.warn("\x1b[30m ▶️ Starting App :");
      await connection();
      app.listen(process.env.port || 8080, () => {
        console.log(`\x1b[32m  🚀 http://localhost:${process.env.port || 8080}/\x1b[0m`);
      });
    } catch (error) {
      console.log("server: " + error);
    }
  };
  

  server();
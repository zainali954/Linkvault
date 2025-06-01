import dotenv from 'dotenv'
dotenv.config()
import app from "./app.js";
import connectDB from "./DB/connectDB.js";
const port = 3000

connectDB().then(
app.listen(port, ()=>{
    console.log(`App is running on port ${port}`)
})
)

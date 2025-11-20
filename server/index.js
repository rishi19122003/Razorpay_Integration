const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

app.get('/', (req, res) => {
    res.send('Razorpay Payment Gateway Integration');
});

app.post("/order", async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_API_KEY,
            key_secret: process.env.RAZORPAY_API_SECRET,
        });
        const options = req.body;
        const order = await razorpay.orders.create(options);
       if(!order){
        return res.status(500).send({message: "Some error occured"});
       }
       res.json(order);

    }catch(error){
        res.status(500).send({message: "Server Error"});
    }
});
app.post("/validate", (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(sign.toString())
            .digest('hex'); 
        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }  
    } catch (error) {
        res.status(500).send({ message: "Server Error" });
    }
});     
    
        
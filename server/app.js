const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")('Your secret Key');

app.use(express.json());
app.use(cors());

app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const { products } = req.body;

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.title,
                    images: [product.image],
                },
                unit_amount: product.price * 100,
            },
            quantity: product.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

app.listen(7000, () => {
    console.log("Server started on port 7000");
});

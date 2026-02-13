require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Server running" });
});

// Create Stripe checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { email } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel"
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Stripe session failed" });
  }
});

// Capture user info
app.post("/capture-user", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    console.log("User captured:", name, email, phone);

    res.json({ status: "User saved" });

  } catch (error) {
    res.status(500).json({ error: "Failed to capture user" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

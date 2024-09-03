import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/authRoute.js';
import stripePackage from 'stripe';
import jwt from 'jsonwebtoken';
import userDetailRoute from './Routes/userDetailRoute.js';
import vaultRoutes from './Routes/vaultRoutes.js';
import addressRoutes from './Routes/addressRoute.js';
import noteRoutes from './Routes/noteRoute.js';
import cardRoutes from './Routes/cardRoute.js';
import bankaccountRoutes from './Routes/bankAccountRoute.js';
import team from './Routes/teamRoute.js';
import User from './models/userSchema.js';

dotenv.config();

const app = express();
const Port = process.env.PORT || 8000;
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/userdetail', userDetailRoute);
app.use('/api/vault', vaultRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/bankaccounts', bankaccountRoutes);
app.use('/api/teamapi',team);



// Authentication Middleware
const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
  
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1];
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
  
        req.decodedToken = decodedToken;
        next();
      });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
};

// Create checkout session
app.post("/api/create-checkout-session", verifyToken, async (req, res) => {
    const { selectedPackage, userId } = req.body;
    const { title, price } = selectedPackage;
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: { name: title },
            unit_amount: parseInt(price * 100),
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/successfull`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      });

      await User.findByIdAndUpdate(userId, { plan: title }, { new: true });
      res.json({ id: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: "Error creating checkout session" });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(Port, () => {
        console.log('Server is running on port', Port);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

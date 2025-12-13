import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

// ==========================================
// 1. CONFIGURATION & DATABASE CONNECTION
// ==========================================
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://sakshi:sakshi123@cluster0.86yrmn2.mongodb.net/MediGo?appName=Cluster0";
const DB_NAME = process.env.DB_NAME || "MediGo";
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "sakshi_super_secret_key_123"; 

let db; 
const getCollection = (name) => db.collection(name);
const toNumber = (v) => (typeof v === "string" ? Number(v) : v);

// ==========================================
// 2. AUTHENTICATION ROUTES (Secure)
// ==========================================

// ➤ REGISTER (Create New User)
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    const users = getCollection("users");

    // Check if user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please Login." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save User
    const newUser = {
      name,
      email,
      password: hashedPassword, 
      type: type || "user",
      createdAt: new Date(),
    };
    
    const result = await users.insertOne(newUser);
    res.status(201).json({ message: "User registered successfully", userId: result.insertedId });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ➤ LOGIN (Verify User & Get Token)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = getCollection("users");

    // Find User
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id, type: user.type }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ==========================================
// 3. APP ROUTES (Consultation, Cart, etc.)
// ==========================================

// Health Check
app.get("/health", (req, res) => {
  return res.json({ ok: true });
});

// ➤ CONSULTATION
app.post("/consultation", async (req, res) => {
  try {
    const consultations = getCollection("consultations");
    const consultData = {
      ...req.body,
      submittedAt: new Date(),
    };
    await consultations.insertOne(consultData);
    res.send("Consultation request stored successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ➤ GET CART
app.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const carts = getCollection("carts");
    const cart = await carts.findOne({ userId });
    res.json({ items: cart?.items || [] });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ➤ ADD TO CART
app.post("/cart/add", async (req, res) => {
  try {
    const { userId, productId, name, price, image } = req.body;
    let { quantity } = req.body;

    if (!userId || productId === undefined) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    quantity = Number(quantity) || 1;
    const pid = toNumber(productId);
    const carts = getCollection("carts");
    let cart = await carts.findOne({ userId });

    if (!cart) {
      cart = {
        userId,
        items: [{ productId: pid, name, price, image, quantity }],
        createdAt: new Date(),
      };
      await carts.insertOne(cart);
    } else {
      const idx = cart.items.findIndex((i) => toNumber(i.productId) === pid);
      if (idx > -1) {
        cart.items[idx].quantity += quantity;
      } else {
        cart.items.push({ productId: pid, name, price, image, quantity });
      }
      await carts.updateOne({ userId }, { $set: { items: cart.items, updatedAt: new Date() } });
    }

    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ➤ UPDATE CART QUANTITY
app.put("/cart", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const pid = toNumber(productId);
    const carts = getCollection("carts");
    const cart = await carts.findOne({ userId });

    if (!cart) return res.json({ items: [] });

    const idx = cart.items.findIndex((i) => toNumber(i.productId) === pid);
    if (idx === -1) return res.json({ items: cart.items });

    if (quantity < 1) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }

    await carts.updateOne({ userId }, { $set: { items: cart.items, updatedAt: new Date() } });
    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ➤ REMOVE FROM CART
app.delete("/cart/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const pid = toNumber(productId);
    const carts = getCollection("carts");
    const cart = await carts.findOne({ userId });

    if (!cart) return res.json({ items: [] });

    const filtered = cart.items.filter((i) => toNumber(i.productId) !== pid);
    await carts.updateOne({ userId }, { $set: { items: filtered, updatedAt: new Date() } });

    res.json({ items: filtered });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ➤ LAB TEST BOOKING
app.post("/lab", async (req, res) => {
  try {
    const labTests = getCollection("labTests");
    const labTestData = {
      ...req.body,
      createdAt: new Date(),
    };
    const result = await labTests.insertOne(labTestData);
    res.send({ message: "Lab test booked successfully", testId: result.insertedId });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ==========================================
// 4. START SERVER
// ==========================================
(async function start() {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`✅ Connected to MongoDB (${DB_NAME})`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
})();
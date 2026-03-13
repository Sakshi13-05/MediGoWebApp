import express from "express"
import productController, { getMedicine } from "../controllers/productController"

const router = express.Router();

// route def
router.get("/:category", getMedicine);
export default router;
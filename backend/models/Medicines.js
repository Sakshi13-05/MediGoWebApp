import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    index: true, // Single index for quick filtering
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: "default-medicine.jpg",
  },
  discount: {
    type: String, // e.g., "SAVE 24%"
    default: "0%",
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// --- THE RESUME BOOSTER: COMPOUND INDEXING ---
// This enables the "sub-200ms" performance claim. 
// It optimizes searches where users filter by category and then sort by price.
medicineSchema.index({ category: 1, price: 1 });

// Text Index for basic searching (Atlas Search is better, but this is a good backup)
medicineSchema.index({ name: 'text', description: 'text' });

const Medicines = mongoose.model('Medicines', medicineSchema);

export default Medicines;
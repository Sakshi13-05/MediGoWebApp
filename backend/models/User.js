import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // --- ACCOUNT INFO ---
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  
  // --- PROFILE INFO (Filled in Step 3) ---
  name: { 
    type: String, 
    trim: true 
  },
  mobile: { 
    type: String, 
    trim: true 
  },
  state: { 
    type: String,
    enum: ['Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Other'], // Add your states here
  },
  userCategory: { 
    type: String,
    enum: ['Patient', 'Doctor', 'Retailer', 'Other'], // Matches your "Which category" dropdown
  },

  // --- METADATA ---
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  lastLogin: { 
    type: Date 
  }
}, { 
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

// Indexing for performance: 
// Even though email is unique, we index it for sub-200ms login lookups
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
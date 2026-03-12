import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import Medicines from './models/Medicines.js'; // Ensure this model exists

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(async () => {

    console.log("Connected to MongoDB Atlas.");

    // 1. Define the correct path to your data folder
    // Since you are in 'backend', and 'data' is in the same folder:
    const dataFolder = './data/'; 

    // 2. List of files to migrate
    const files = [
      'Medicines.json',
      'Children.json',
      'ElderProducts.json',
      'LabTest.json',
      'MenProducts.json',
      'Women.json'
    ];

    // 3. Clear existing data
    await Medicines.deleteMany({});
    console.log("Emptying collection...");

    // 4. Loop through files and insert
    for (const file of files) {
      // ... inside your loop in seed.js
for (const file of files) {
  const filePath = `${dataFolder}${file}`;
  
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    
    // NORMALIZE THE DATA BEFORE INSERTING
    const processedData = jsonData.map(item => {
      return {
        name: item.name || item.productName || "Unnamed Product", // Handles different name keys
        category: item.category || file.replace('.json', ''),
        // This line looks for 'price', 'cost', or 'rate'. If none exist, it sets it to 0.
        price: Number(item.price || item.cost || item.rate || 0), 
        description: item.description || "",
        image: item.image || item.img || "",
        discount: item.discount || "0%"
      };
    });

    try {
      await Medicines.insertMany(processedData);
      console.log(`🚀 Successfully Migrated: ${file}`);
    } catch (validationError) {
      console.error(`❌ Validation failed for ${file}:`, validationError.message);
      // Optional: continue to the next file instead of crashing
    }
  }
}
    }

    console.log("ALL DATA MIGRATED SUCCESSFULLY!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
  });
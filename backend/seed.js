import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const dataPath='/frontend/my-app/src/data/Medicines.json';


mongoose.connect("mongodb+srv://sakshi:Sak13@31@cluster0.86yrmn2.mongodb.net/"  )
.then(
    async ()=>{
        console.log("connection built successfully");
        const MedicineData= JSON.parse(fs.readFileSync(dataPath,'utf-8'))
        await Medicine.insertMany(MedicineData);
        console.log("data added to mongodb")
        process.exit();
    }
)
.catch((err)=>{console.log(err)})
import Medicines from "../models/Medicines";
// represent medicine collectio in database

export const getMedicine = async (req, res) => {
    // dont write  default
    // try-catch for error handling
    try {
        const { category } = req.params;
        // extract category parameter from url
        const pdts = await Medicines.find({ category }).lean();
        // .lean()=> returns a MOM- makes query faster-return plain JS obj-achieve 200ms pf performance
        res.json(pdts);
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}
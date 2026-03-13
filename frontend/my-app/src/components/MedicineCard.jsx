import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GiPriceTag } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import { api } from "../utils/api";
import { toast } from "react-toastify";

import "./MedicineCard.css";

function MedicineCard({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [similarMedicines, setSimilarMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicineData = async () => {
      try {
        setLoading(true);
        // Fetch current medicine
        const res = await api.get(`/product/${id}`);
        setMedicine(res.data);

        // Fetch similar medicines by category
        if (res.data.category) {
          const similarRes = await api.get(`/products/${res.data.category}`);
          setSimilarMedicines(similarRes.data.filter(m => (m.id || m._id) != id).slice(0, 4));
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching medicine:", err);
        setError("Product not found or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineData();
  }, [id]);

  if (loading) return (
    <div className="loading-container">
      <FaSpinner className="spinner" />
      <p>Loading Product details...</p>
    </div>
  );

  if (error || !medicine) {
    return (
      <div className="error-container">
        <h2>{error || "Medicine not found"}</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.warning("Please login to add items to cart");
      return;
    }

    api
      .post("/cart/add", {
        userId: user?.userId,
        productId: medicine.id || medicine._id,
        name: medicine.name,
        price: medicine.price,
        image: medicine.image,
        quantity: 1,
      })
      .then((response) => {
        toast.success("Medicine added to cart successfully!");
      })
      .catch((error) => {
        console.error("Error adding medicine to cart:", error);
        toast.error("Failed to add medicine to cart.");
      });
  };

  return (
    <div className="medicine-detail-page">
      <h2>{medicine.name}</h2>

      <div className="medicine-detail-container">
        <img src={medicine.image} alt={medicine.name} />

        <div className="medicine-info">
          {medicine.chemicalName && <p><b>Chemical Name:</b> {medicine.chemicalName}</p>}
          <p><b>Description:</b> {medicine.description || medicine.details}</p>

          <p className="price-section">
            <b><GiPriceTag /> Price:</b> <span className="price">₹{medicine.price}</span> &nbsp;
            {medicine.mrp && <span className="mrp">MRP: ₹{medicine.mrp}</span>}
          </p>

          {medicine.discount && (
            <p className="discount">
              <RiDiscountPercentFill /> {medicine.discount} OFF
            </p>
          )}
          <div className="button-group">
            <button onClick={handleAddToCart}>Quick Add</button>
            <button onClick={() => navigate("/cart")}>View My Cart</button>
          </div>
        </div>
      </div>

      <h3>Recommended for You</h3>
      <div className="recommendation-list">
        {similarMedicines.length > 0 ? (
          similarMedicines.map((med) => (
            <div
              key={med._id || med.id}
              className="recommendation-card"
              onClick={() => navigate(`/medicine/details/${med.id || med._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={med.image} alt={med.name} />
              <h4>{med.name}</h4>
              <p className="price">₹{med.price}</p>
            </div>
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </div>
  );
}

export default MedicineCard;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GiPriceTag } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import { api } from "../utils/api";
import "./MedicineCat.css";

function MedicineCat() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // category here is sub-category like 'cold-fever'
        const response = await api.get(`/products/${category}`);
        setMedicines(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError("Failed to load products for this category.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  if (loading) return (
    <div className="loading-container">
      <FaSpinner className="spinner" />
      <p>Finding the best medicines for you...</p>
    </div>
  );

  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="medicine-page">
      <h2>Medicines for {category.replace(/-/g, ' ')}</h2>

      {medicines.length === 0 ? (
        <p>No medicines found for this category at the moment.</p>
      ) : (
        <div className="medicine-list">
          {medicines.map((med) => (
            <div
              key={med._id || med.id}
              className="medicine-card"
              onClick={() => navigate(`/medicine/details/${med.id || med._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={med.image} alt={med.name} />
              <h4>{med.name}</h4>
              {med.chemicalName && <p>Chemical Name: {med.chemicalName}</p>}
              <p>{med.description || med.details}</p>
              <p>
                <b><span><GiPriceTag /></span>Price:</b> ₹{med.price} &nbsp;
                {med.mrp && <span className="mrp">MRP: ₹{med.mrp}</span>}
              </p>
              {med.discount && (
                <p className="discount">
                  <span><RiDiscountPercentFill /></span>{med.discount} {med.discount.includes('%') ? "" : "OFF"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicineCat;

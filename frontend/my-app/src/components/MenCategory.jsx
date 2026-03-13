import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { FaSpinner } from "react-icons/fa";
import { GiPriceTag } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import "./MenCategory.css";

function MenCategory() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${category}`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching men category products:", err);
        setError("Failed to load products for this category.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  if (loading) return (
    <div className="loading-container flex flex-col items-center justify-center min-h-[400px]">
      <FaSpinner className="animate-spin text-4xl text-teal-600 mb-4" />
      <p>Loading Men's collection...</p>
    </div>
  );

  if (error) return <div className="error-container text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="medicine-page">
      <h2>Men's Products for {category.replace(/-/g, ' ')}</h2>

      {products.length === 0 ? (
        <p className="text-center py-10">No data available in this category.</p>
      ) : (
        <div className="medicine-list">
          {products.map((item) => (
            <div
              key={item._id || item.id}
              className="medicine-card"
              onClick={() => navigate(`/men/details/${item.id || item._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              {item.chemicalName && <p>Chemical Name: {item.chemicalName}</p>}
              <p>{item.details || item.description}</p>
              <p>
                <b><GiPriceTag /> Price:</b> ₹{item.price} &nbsp;
                {item.mrp && <span className="mrp">MRP: ₹{item.mrp}</span>}
              </p>
              {item.discount && (
                <p className="discount">
                  <RiDiscountPercentFill /> {item.discount} {typeof item.discount === 'number' ? "% OFF" : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenCategory;


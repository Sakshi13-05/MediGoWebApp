import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { FaSpinner } from "react-icons/fa";
import { GiPriceTag } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import "./ChildrenCat.css";

function ChildrenCat() {
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
        console.error("Error fetching child category products:", err);
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
      <p>Loading Children's collection...</p>
    </div>
  );

  if (error) return <div className="error-container text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="child-page">
      <h2>Products for {category.replace(/-/g, ' ')}</h2>

      {products.length === 0 ? (
        <p className="text-center py-10">No data available in this category.</p>
      ) : (
        <div className="child-list">
          {products.map((pro) => (
            <div
              key={pro._id || pro.id}
              className="child-card"
              onClick={() => navigate(`/child/details/${pro.id || pro._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={pro.image} alt={pro.name} />
              <h4>{pro.name}</h4>
              {pro.chemicalName && <p>Chemical Name: {pro.chemicalName}</p>}
              <p>{pro.details || pro.description}</p>
              <p>
                <b>
                  <span>
                    <GiPriceTag />
                  </span>
                  Price:
                </b>{" "}
                ₹{pro.price} &nbsp;
                {pro.mrp && <span className="mrp">MRP: ₹{pro.mrp}</span>}
              </p>
              {pro.discount && (
                <p className="discount">
                  <span>
                    <RiDiscountPercentFill />
                  </span>
                  {pro.discount} {typeof pro.discount === 'number' ? "% OFF" : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChildrenCat;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { api } from "../utils/api";
import "./WomenCat.css";

function WomenCat() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${category}`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching women's products:", err);
        setError("Failed to load products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchWomenProducts();
  }, [category]);

  if (loading) return (
    <div className="women-category-page">
      <h2>Loading products...</h2>
      <div className="women-product-grid">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="women-product-card groww-card skeleton" style={{ height: '300px', opacity: 0.6 }}></div>
        ))}
      </div>
    </div>
  );

  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="women-category-page">
      <h2>{category.replace(/-/g, " ")}</h2>
      {products.length === 0 ? (
        <p className="no-products text-center py-10">No data available in this category.</p>
      ) : (
        <div className="women-product-grid">
          {products.map((product) => (
            <div
              key={product._id || product.id}
              className="women-product-card"
              onClick={() => navigate(`/women/details/${product.id || product._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p className="description">{product.description || product.details}</p>
              <div className="price-info">
                <span className="price">₹{product.price}</span>
                {product.mrp && <span className="mrp">₹{product.mrp}</span>}
              </div>
              {product.discount && (
                <p className="discount-badge">{product.discount} OFF</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WomenCat;

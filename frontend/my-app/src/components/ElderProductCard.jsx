import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GiPriceTag } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { api } from "../utils/api";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import "./ElderProductCard.css";

function ElderProductCard({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/product/${id}`);
        setProduct(res.data);

        if (res.data.category) {
          const similarRes = await api.get(`/products/${res.data.category}`);
          setSimilarProducts(
            similarRes.data.filter((p) => (p.id || p._id).toString() !== id.toString())
          );
        }
      } catch (err) {
        console.error("Error fetching elder product:", err);
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <FaSpinner className="animate-spin text-4xl text-teal-600 mb-4" />
      <p>Loading product details...</p>
    </div>
  );

  if (!product) return <div className="text-center py-20">Product not found</div>;

  const handleAddToCart = () => {
    if (!user) {
      toast.warn("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    setAdding(true);
    api
      .post("/cart/add", {
        userId: user.userId,
        productId: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
      .then((response) => {
        toast.success(`${product.name} added to cart!`);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add to cart.");
      })
      .finally(() => setAdding(false));
  };

  return (
    <div className="elder-detail-page">
      <h2>{product.name}</h2>

      <div className="elder-detail-container">
        <img src={product.image} alt={product.name} />

        <div className="elder-info">
          <p><b>Chemical Name:</b> {product.chemicalName || "N/A"}</p>
          <p><b>Details:</b> {product.details || product.description}</p>
          <p className="price-block">
            <b><GiPriceTag /> Price:</b> ₹{product.price} &nbsp;
            {product.mrp && <span className="mrp">MRP: ₹{product.mrp}</span>}
          </p>
          <p className="discount">
            <RiDiscountPercentFill /> {product.discount}
          </p>
          <div className="button-group">
            <button onClick={handleAddToCart} disabled={adding}>
              {adding ? "Adding..." : "Quick Add"}
            </button>
            <button onClick={() => navigate("/cart")}>View My Cart</button>
          </div>
        </div>
      </div>

      <h3>Recommended for You</h3>
      <div className="recommendation-list">
        {similarProducts.slice(0, 4).map((item) => (
          <div
            key={item._id || item.id}
            className="recommendation-card"
            onClick={() => navigate(`/elder/details/${item.id || item._id}`)}
            style={{ cursor: "pointer" }}
          >
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ElderProductCard;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GiPriceTag } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { api } from "../utils/api";
import "./WomenCard.css";

function WomenCard() {
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
        console.error("Error fetching product:", err);
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const getFinalPrice = (mrp, discount = 0) => {
    const disc = typeof discount === 'string' ? parseInt(discount) : discount;
    return Math.round(mrp * (1 - (disc || 0) / 100));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <FaSpinner className="animate-spin text-4xl text-teal-600 mb-4" />
      <p>Loading product details...</p>
    </div>
  );

  if (!product) return <div className="text-center py-20">Product not found</div>;

  const basePrice = product.mrp ?? product.price ?? 0;
  const discountPct = product.discount ? (typeof product.discount === 'string' ? parseInt(product.discount) : product.discount) : 0;
  const dealPrice = getFinalPrice(basePrice, discountPct);
  const saved = Math.round(basePrice - dealPrice);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.userId) {
      toast.warn("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      await api.post("/cart/add", {
        userId: user.userId,
        productId: product.id || product._id,
        name: product.name,
        price: dealPrice,
        image: product.image,
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error adding to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="women-detail-page">
      <h2>{product.name}</h2>

      <div className="women-detail-container">
        <img src={product.image} alt={product.name} />

        <div className="women-info">
          <p>
            <b>Chemical Name:</b> {product.chemicalName || "N/A"}
          </p>
          <p>
            <b>Details:</b> {product.details || product.description}
          </p>

          <div className="price-block">
            <span className="final-price"><GiPriceTag/> ₹{dealPrice}</span>
            {discountPct > 0 && (
              <>
                <span className="mrp-strike">₹{basePrice}</span>
                <span className="discount-tag">
                  <RiDiscountPercentFill /> {discountPct}% off
                </span>
                <span className="you-save">You save ₹{saved}</span>
              </>
            )}
          </div>

          <div className="button-group">
            <button onClick={handleAddToCart} disabled={adding}>
              {adding ? "Adding..." : "Quick Add"}
            </button>
            <button onClick={() => navigate("/cart")}>View My Cart</button>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <>
          <h3>Recommended for You</h3>
          <div className="women-recommendation-list">
            {similarProducts.slice(0, 4).map((pro) => {
              const recBase = pro.mrp ?? pro.price ?? 0;
              const recDisc = pro.discount ? (typeof pro.discount === 'string' ? parseInt(pro.discount) : pro.discount) : 0;
              const recFinal = getFinalPrice(recBase, recDisc);

              return (
                <div
                  key={pro._id || pro.id}
                  className="women-recommendation-card"
                  onClick={() => navigate(`/women/details/${pro.id || pro._id}`)}
                >
                  <img src={pro.image} alt={pro.name} />
                  <h4>{pro.name}</h4>
                  <p>
                    ₹{recFinal}{" "}
                    {recDisc > 0 && (
                      <span className="mrp-strike">₹{recBase}</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default WomenCard;


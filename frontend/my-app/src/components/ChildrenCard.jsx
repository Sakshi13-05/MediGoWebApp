import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GiPriceTag } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { api } from "../utils/api";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import "./ChildrenCard.css";

function ChildrenCard() {
  const navigate = useNavigate();
  const { id } = useParams();
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
        console.error("Error fetching child product:", err);
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const getFinalPrice = (mrp, discount = 0) => {
    const disc = typeof discount === 'string' ? parseInt(discount) : discount;
    return Math.round((mrp || 0) * (1 - (disc || 0) / 100));
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
  const saved = Math.max(0, basePrice - dealPrice);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.userId) {
      toast.warn("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      await api.post(`/cart/add`, {
        userId: user.userId,
        productId: product.id || product._id,
        name: product.name,
        price: dealPrice,      // discounted price sent to backend
        image: product.image,
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="child-detail-page">
      <h2>{product.name}</h2>

      <div className="child-detail-container">
        <img src={product.image} alt={product.name} />

        <div className="child-info">
          <p>
            <b>Chemical Name:</b> {product.chemicalName || "N/A"}
          </p>
          <p>
            <b>Details:</b> {product.details || product.description}
          </p>

          <div className="price-block">
            <span className="final-price">₹{dealPrice}</span>
            {discountPct > 0 && (
              <>
                <span className="mrp">₹{basePrice}</span>
                <span className="discount">
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
          <div className="child-recommendation-list">
            {similarProducts.slice(0, 4).map((pro) => {
              const recBase = pro.mrp ?? pro.price ?? 0;
              const recDisc = pro.discount ? (typeof pro.discount === 'string' ? parseInt(pro.discount) : pro.discount) : 0;
              const recFinal = getFinalPrice(recBase, recDisc);
              return (
                <div
                  key={pro._id || pro.id}
                  className="child-recommendation-card"
                  onClick={() => navigate(`/child/details/${pro.id || pro._id}`)}
                >
                  <img src={pro.image} alt={pro.name} />
                  <h4>{pro.name}</h4>
                  <p>
                    ₹{recFinal}{" "}
                    {recDisc > 0 && (
                      <span className="mrp">₹{recBase}</span>
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

export default ChildrenCard;


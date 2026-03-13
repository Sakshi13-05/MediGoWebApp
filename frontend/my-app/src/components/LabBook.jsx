import React, { useState, useEffect } from "react";
import "./LabBook.css";
import { useNavigate } from "react-router-dom";
import { FaCommentMedical, FaSpinner } from "react-icons/fa";
import LabSearch from "./LabSearch";
import { api } from "../utils/api";

function LabBook({ user }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState(null);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products/LabTest");
        setLabTests(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch lab tests:", err);
        setError("Unable to load tests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);


  const filteredTests = labTests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBooking = (test) => {
    if (!user) {
      alert("Please login to book a test");
      return;
    }
    setCart(test);

    api
      .post("/lab", {
        userId: user.userId,
        testId: test.id || test._id,
        testName: test.name,
        price: test.price,
        fasting: test.fasting || "No fasting required",
        reportTime: test.reportTime || "24 hours",
        includes: test.description || test.includes || ""
      })
      .then((res) => {
        alert("Test added to cart!");
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Booking failed. Please try again.");
      });
  };

  if (loading) return (
    <div className="loading-container">
      <FaSpinner className="spinner" />
      <p>Fetching Lab Tests...</p>
    </div>
  );

  if (error) return <div className="error-container">{error}</div>;

  return (
    <>
      <LabSearch setSearchTerm={setSearchTerm} suggestions={labTests} />
      <div className="lab-booking-container">
        <div className="tests-section">
          <h2><FaCommentMedical /> Book Your Lab And Blood Tests Online</h2>
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <div
                key={test._id || test.id}
                className={`test-card ${cart && (cart._id === test._id || cart.id === test.id) ? "selected" : ""
                  }`}
              >
                <div className="test-details">
                  <h3>{test.name}</h3>
                  {(test.description || test.includes) && (
                    <p className="includes">{test.description || test.includes}</p>
                  )}
                  <div className="price-section">
                    <span className="price">₹{test.price}</span>
                    {test.mrp && <span className="mrp">₹{test.mrp}</span>}
                    {test.discount && <span className="discount">{test.discount}</span>}
                  </div>
                  <div className="info-section">
                    <span>🧪 {test.fasting || "N/A"}</span>
                    <span>📄 {test.reportTime || "Same Day"}</span>
                  </div>
                </div>
                <button className="book-btn" onClick={() => handleBooking(test)}>
                  {cart && (cart._id === test._id || cart.id === test.id) ? "Booked" : "Book"}
                </button>
              </div>
            ))
          ) : (
            <p>No tests found</p>
          )}
        </div>

        <div className="cart-section">
          {cart ? (
            <>
              <h3>Test Added to Cart</h3>
              <p><strong>{cart.name}</strong></p>
              <p>Price: ₹{cart.price}</p>
              <p>{cart.fasting}</p>
              <p>{cart.reportTime}</p>
              {(cart.description || cart.includes) && <p>{cart.description || cart.includes}</p>}
              <button
                onClick={() => {
                  navigate("/view", { state: { bookingDetails: cart } });
                }}

                className="view-cart-btn"
              >View Cart</button>
            </>
          ) : (
            <>
              <h3>Please select a test to proceed</h3>
              <button className="view-cart-btn disabled">View Cart</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default LabBook;


import React, { useState, useEffect } from "react";
import "./ConsultationHistory.css";
import { api } from "../utils/api";
import { FaSpinner } from "react-icons/fa";

function ConsultationHistory() {
  const [pastConsultations, setPastConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Using the standardized /products/:category route
        const response = await api.get("/products/pastConsultations");
        setPastConsultations(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch consultation history:", err);
        setError("Unable to load history at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="history-container flex flex-col items-center py-8">
        <FaSpinner className="animate-spin text-3xl text-teal-600 mb-2" />
        <p>Loading consultation history...</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>Your Past Consultations</h2>
      {error ? (
        <p className="error-message text-center text-red-500">{error}</p>
      ) : pastConsultations.length > 0 ? (
        pastConsultations.map((item, index) => (
          <div className="history-card" key={index}>
            <div className="history-header">
              <h3>{item.doctor} ({item.specialty})</h3>
              <span className="rating">⭐ {item.rating}</span>
            </div>
            <p><strong>Patient:</strong> {item.name}</p>
            <p><strong>Date:</strong> {item.date} at {item.time}</p>
            <p><strong>Feedback:</strong> {item.feedback}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-4">No data available in this category.</p>
      )}
    </div>
  );
}

export default ConsultationHistory;


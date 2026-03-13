// src/pages/DoctorPage.jsx
import React, { useState, useEffect } from "react";
import HeroBanner from "../components/HeroBanner";
import SpecialtySelector from "../components/SpecialtySelector";
import DoctorCard from "../components/DoctorCard";
import DoctorForm from "../components/DoctorForm";
import { api } from "../utils/api";
import { FaSpinner } from "react-icons/fa";
import "../components/DoctorCard.css";
import ConsultationHistory from "../components/ConsultationHistory";

function DoctorPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products/doctors");
        setDoctors(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Unable to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on selected specialty
  const filteredDoctors =
    selectedSpecialty === "All"
      ? doctors
      : doctors.filter((doc) => doc.specialty === selectedSpecialty);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-teal-600 mb-4" />
        <p className="text-gray-600">Finding available doctors...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero banner */}
      <HeroBanner />

      {/* Specialty pills */}
      <SpecialtySelector
        selected={selectedSpecialty}
        onSelect={setSelectedSpecialty}
      />

      {/* Doctor Cards */}
      <div className="doctor-card-container">
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc, i) => (
            <DoctorCard
              key={i}
              doctor={doc}
              onConsultClick={() => setShowForm(true)}
            />
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            No data available in this category.
          </p>
        )}
      </div>

      {/* Form appears on Consult button click */}
      {showForm && <DoctorForm onClose={() => setShowForm(false)} />}

      {/* 👇 Past consultations always visible */}
      <ConsultationHistory />
    </div>
  );
}

export default DoctorPage;


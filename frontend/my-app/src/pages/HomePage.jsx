import React from 'react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import SearchBar from '../components/SearchBar';
import FeatureRow from '../components/FeatureRow';
import BannerCarousel from '../components/BannerCarousel';
import TopProducts from '../components/TopProducts';


function HomePage() {
  return (
    <div>
      2wsxcdewsdxcf3wsdxcf3waszxcf32qAZ<SearchBar />
      <FeatureRow/>
      <BannerCarousel />
      <TopProducts />
      {/* footer */}
      <footer class="footer-section">
  <div class="footer-container">
    <div class="footer-col">
      <h3>MediGo</h3>
      <p>Your trusted pharmacy partner.</p>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul>
        <li>About Us</li>
        <li>Medicines</li>
        <li>Privacy Policy</li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <p>support@medigo.com</p>
    </div>
  </div>
</footer>
    </div>

  );
}

export default HomePage;

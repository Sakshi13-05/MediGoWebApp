import React from 'react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import SearchBar from '../components/SearchBar';
import FeatureRow from '../components/FeatureRow';
import BannerCarousel from '../components/BannerCarousel';
import TopProducts from '../components/TopProducts';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div>
      <SearchBar />
      <FeatureRow/>
      <BannerCarousel />
      <TopProducts />
      {/* footer */}
      <Footer/>
    </div>

  );
}

export default HomePage;

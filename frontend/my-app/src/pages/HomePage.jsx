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
      
 
    
      <SearchBar />
      <FeatureRow/>
      <BannerCarousel />
      <TopProducts />
      
    </div>
  );
}

export default HomePage;

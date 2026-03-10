import React from 'react';
import { Pill, Bottle, Droplet, ShieldCheck } from 'lucide-react';
import './TopProducts.css';


const products = [
  {
    name: 'Paracetamol 500mg',
    price: '₹25',
    icon: <Pill size={42} color="#00b894" strokeWidth={1.5} />,
  },
  {
    name: 'Multivitamin Capsules',
    price: '₹130',
    icon: <Bottle size={42} color="#00b894" strokeWidth={1.5} />,
  },
  {
    name: 'Cough Syrup',
    price: '₹95',
    icon: <Droplet size={42} color="#00b894" strokeWidth={1.5} />,
  },
  {
    name: 'Hand Sanitizer',
    price: '₹60',
    icon: <ShieldCheck size={42} color="#00b894" strokeWidth={1.5} />,
  },
];


function TopProducts() {
  return (
    <div className="top-products-section">
      <h2 className="section-title">Top Products</h2>
      <div className="products-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <div className="product-img-container">
              {product.icon}
            </div>
            <h4>{product.name}</h4>
            <p>{product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopProducts;


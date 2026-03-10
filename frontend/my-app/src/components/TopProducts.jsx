import React from 'react';
import { Pill, PillBottle, Droplets, ShieldCheck } from 'lucide-react';
import './TopProducts.css';

const products = [
  {
    name: 'Paracetamol 500mg',
    price: '₹25',
    icon: Pill,
  },
  {
    name: 'Multivitamin Capsules',
    price: '₹130',
    icon: PillBottle,
  },
  {
    name: 'Cough Syrup',
    price: '₹95',
    icon: Droplets,
  },
  {
    name: 'Hand Sanitizer',
    price: '₹60',
    icon: ShieldCheck,
  },
];

function TopProducts() {
  return (
    <div className="top-products-section">
      <h2 className="section-title">Top Products</h2>
      <div className="products-grid">
        {products.map((product, index) => {
          const Icon = product.icon;
          return (
            <div className="product-card" key={index}>
              <div className="product-img-container">
                <Icon size={42} color="#00b894" strokeWidth={1.5} />
              </div>
              <h4>{product.name}</h4>
              <p>{product.price}</p>
              <button>Add to Cart</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopProducts;



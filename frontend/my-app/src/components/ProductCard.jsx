import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiStar } from 'react-icons/fi';

const ProductCard = ({ product, index, onAddToCart }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="groww-card"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Discount Badge */}
      {product.discount && (
        <div style={{ 
          position: 'absolute', top: '16px', left: '16px', 
          backgroundColor: '#EBFBF5', color: '#00D09C', 
          padding: '4px 10px', borderRadius: '6px', 
          fontSize: '12px', fontWeight: 700, zIndex: 1 
        }}>
          {product.discount}
        </div>
      )}

      {/* Product Image */}
      <div style={{ 
        width: '100%', height: '160px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px', height: '44px', overflow: 'hidden' }}>
          {product.name}
        </h3>
        <p style={{ color: '#636E72', fontSize: '13px', marginBottom: '16px' }}>{product.category}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
          <FiStar style={{ fill: '#F1C40F', stroke: '#F1C40F', fontSize: '14px' }} />
          <span style={{ fontSize: '14px', fontWeight: 700 }}>4.8</span>
          <span style={{ color: '#95A5A6', fontSize: '12px' }}>(120)</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#95A5A6', textDecoration: 'line-through' }}>₹{(product.price * 1.25).toFixed(0)}</p>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#2D3436' }}>₹{product.price}</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddToCart(product)}
          style={{ 
            backgroundColor: '#00D09C', color: 'white', 
            width: '40px', height: '40px', 
            borderRadius: '12px', display: 'flex', 
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 208, 156, 0.3)'
          }}
        >
          <FiPlus fontSize="20px" strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;

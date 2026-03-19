import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="groww-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
      <div className="skeleton" style={{ width: '100%', height: '160px', marginBottom: '20px' }}></div>
      <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: '12px' }}></div>
      <div className="skeleton" style={{ width: '40%', height: '16px', marginBottom: '20px' }}></div>
      
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: '30%', height: '24px' }}></div>
        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '12px' }}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;

import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiBriefcase, FiCalendar, FiUser } from 'react-icons/fi';

const Dashboard = ({ user }) => {
  const stats = [
    { label: 'Upcoming Appointments', value: '2', icon: <FiCalendar />, color: '#00D09C' },
    { label: 'Health Score', value: '85/100', icon: <FiActivity />, color: '#3498DB' },
    { label: 'Active Consultations', value: '1', icon: <FiBriefcase />, color: '#F1C40F' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}
    >
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome back, {user?.name || 'User'}!</h1>
        <p style={{ color: '#636E72' }}>Here's what's happening with your health today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="groww-card"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ 
                padding: '12px', 
                borderRadius: '12px', 
                backgroundColor: `${stat.color}15`, 
                color: stat.color,
                fontSize: '24px'
              }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#636E72', fontWeight: 500 }}>{stat.label}</p>
                <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</h3>
              </div>
            </div>
            <button style={{ color: '#00D09C', fontWeight: 600, fontSize: '14px' }}>View Details →</button>
          </motion.div>
        ))}
      </div>

      <section style={{ marginTop: '60px' }}>
        <h2 style={{ marginBottom: '24px' }}>Recent Activity</h2>
        <div className="groww-card" style={{ padding: '0' }}>
          {[1,2,3].map((_, i) => (
            <div key={i} style={{ 
              padding: '20px 24px', 
              borderBottom: i === 2 ? 'none' : '1px solid #F1F2F6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00D09C' }}></div>
                <div>
                  <p style={{ fontWeight: 600 }}>Paracetamol Refill</p>
                  <p style={{ fontSize: '12px', color: '#636E72' }}>Yesterday at 4:30 PM</p>
                </div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#00D09C' }}>Completed</span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;

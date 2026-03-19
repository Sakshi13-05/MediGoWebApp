import { Link } from "react-router-dom";
import { FiUser, FiShoppingCart, FiSearch, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import "./Header.css";

function Header({ openLogin, user, handleLogout }) {
  return (
    <header className="navbar-glass" style={{ height: '72px', display: 'flex', alignItems: 'center' }}>
      <div style={{ 
        maxWidth: '1200px', 
        width: '100%', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ 
            fontSize: '24px', 
            background: 'linear-gradient(90deg, #00D09C 0%, #00b386 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>MediGo</h1>
        </Link>

        {/* Search Bar - Aesthetic Focus */}
        <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: '400px', margin: '0 40px' }}>
          <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#95A5A6' }} />
          <input 
            type="text" 
            placeholder="Search for medicines, labs..." 
            className="input-base"
            style={{ paddingLeft: '48px', height: '44px', background: '#F1F2F6', border: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: 'rgba(0, 208, 156, 0.1)', color: '#00D09C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '14px'
                }}>
                  {user.name.charAt(0)}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.name}</span>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                style={{ color: '#E74C3C', cursor: 'pointer' }}
                title="Logout"
              >
                <FiLogOut />
              </motion.button>
            </div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              onClick={openLogin}
              style={{ height: '40px', padding: '0 20px', borderRadius: '10px', fontSize: '14px' }}
            >
              Login / Signup
            </motion.button>
          )}

          <Link to="/cart" style={{ position: 'relative', color: '#2D3436' }}>
            <FiShoppingCart style={{ fontSize: '22px' }} />
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key="cart-count"
              style={{ 
                position: 'absolute', top: '-8px', right: '-8px', 
                background: '#00D09C', color: 'white', 
                fontSize: '10px', fontWeight: 700, 
                width: '18px', height: '18px', 
                borderRadius: '50%', display: 'flex', 
                alignItems: 'center', justifyContent: 'center',
                border: '2px solid white'
              }}
            >
              2
            </motion.span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;


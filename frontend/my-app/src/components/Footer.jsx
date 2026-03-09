import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-section"> {/* Changed class to className */}
      <div className="footer-container"> {/* Changed class to className */}
        
        <div className="footer-col"> {/* Changed class to className */}
          <h3>MediGo</h3>
          <p>Your trusted pharmacy partner.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            {/* Added <a> tags so these are actually clickable links */}
            <li><a href="/about">About Us</a></li>
            <li><a href="/medicines">Medicines</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>support@medigo.com</p>
          <p>+91 98765 43210</p>
        </div>

      </div>
      
      {/* Added a copyright bar - essential for production apps */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MediGo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
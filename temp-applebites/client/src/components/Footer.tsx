import { Link } from "wouter";
import meritageLogoPath from "@assets/Meritage Logo2.png";

import Meritage_Logo from "@assets/Meritage Logo.png";

export function Footer() {
  return (
    <footer >
      <div >
        <div >
          {/* Logo and Description */}
          <div >
            <div >
              <img 
                src={Meritage_Logo} 
                alt="Meritage Partners" 
                
              />
            </div>
            <p >
              Whether you're scaling, preparing to sell, or exploring strategic partnerships—Meritage Partners is here to guide your next move.
            </p>
          </div>

          {/* Links */}
          <div >
            <h3 >Links</h3>
            <div >
              <a 
                href="https://meritage.partners/privacypolicy" 
                target="_blank" 
                rel="noopener noreferrer"
                
              >
                Privacy Policy
              </a>
              <a 
                href="https://meritage.partners/termsofuse" 
                target="_blank" 
                rel="noopener noreferrer"
                
              >
                Terms of Use
              </a>
              <a 
                href="https://meritage.partners/cookies" 
                target="_blank" 
                rel="noopener noreferrer"
                
              >
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div >
            <h3 >Address:</h3>
            <div >
              <p >2901 West Coast Highway Suite 200, Newport Beach California 92663</p>
              <p >(949) 522-9121</p>
              <a 
                href="mailto:info@meritage-partners.com" 
                
              >
                info@meritage-partners.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div >
          <p >
            © {new Date().getFullYear()}. Meritage Partners. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
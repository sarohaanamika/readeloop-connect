
import { Link } from "react-router-dom";
import { Book, Mail, Phone, MapPin, Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Book className="h-6 w-6" />
              <span className="text-xl font-display font-bold">Athenaeum</span>
            </div>
            <p className="text-sm text-white/80 max-w-xs">
              A modern library management system designed to help readers discover, borrow, and return books seamlessly.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="hover:text-white/80 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white/80 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white/80 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-white/80 hover:text-white transition-colors duration-300">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors duration-300">
                  Member Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/80 hover:text-white transition-colors duration-300">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                  Reading Lists
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                  Book Recommendations
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">
                  Library Events
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">123 Library Street, Booktown, BK 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-white/80">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-white/80">contact@athenaeum.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 text-center text-white/60 text-sm">
          <p>&copy; {currentYear} Athenaeum Library. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

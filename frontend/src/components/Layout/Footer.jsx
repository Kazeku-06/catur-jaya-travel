import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {import.meta.env.VITE_APP_NAME}
            </h3>
            <p className="text-gray-300 mb-4">
              Layanan travel terpercaya untuk perjalanan Anda. Kami menyediakan 
              paket trip, travel antar kota, dan layanan carter mobil.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FiPhone size={16} />
                <span className="text-gray-300">+62 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail size={16} />
                <span className="text-gray-300">info@webtravel.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin size={16} />
                <span className="text-gray-300">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/trips" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Paket Trip
              </Link>
              <Link 
                to="/travels" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Travel
              </Link>
              <Link 
                to="/carter-mobiles" 
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Carter Mobil
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan Kami</h3>
            <div className="space-y-2 text-gray-300">
              <p>• Paket Wisata Domestik</p>
              <p>• Travel Antar Kota</p>
              <p>• Carter Mobil Harian</p>
              <p>• Konsultasi Perjalanan</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2026 {import.meta.env.VITE_APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
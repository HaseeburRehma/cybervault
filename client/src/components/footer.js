import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between px-4">
        <div className="mb-8 md:mb-0 md:w-1/3 text-center md:text-left">
          <img src='/images/passlogo3.png' alt='helmet' className='mb-4 mx-auto rounded-full md:mx-0' style={{ width: '250px', height: '250px' }} />
          {/* <h2 className="text-2xl font-bold mb-4">Password Gladiator</h2> */}
        </div>
        <div className="flex flex-col md:flex-row md:w-2/3 justify-between">
          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/support" className="hover:underline">Support</Link></li>
              <li><Link to="/team" className="hover:underline">Meet Our Team</Link></li>
              <li><Link to="/news-media" className="hover:underline">News & Media</Link></li>
              <li><Link to="/projects" className="hover:underline">Our Projects</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Industry</h3>
            <ul className="space-y-2">
              <li><Link to="/autofill" className="hover:underline">Autofill</Link></li>
              <li><Link to="/passwordgenerator" className="hover:underline">Password Generator</Link></li>
              <li><Link to="/passwordvault" className="hover:underline">Password Vault</Link></li>
              <li><Link to="/family-manager" className="hover:underline">Family Manager</Link></li>
              <li><Link to="/team" className="hover:underline">Team</Link></li>
              <li><Link to="/sharing" className="hover:underline">Sharing</Link></li>
            </ul>
          </div>
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://facebook.com" className="text-blue-600 text-2xl hover:text-blue-700">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" className="text-blue-400 text-2xl hover:text-blue-500">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" className="text-blue-700 text-2xl hover:text-blue-800">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" className="text-pink-600 text-2xl hover:text-pink-700">
                <FaInstagram />
              </a>
            </div>

            <div className='mt-4'>
              <p className="mb-2 flex items-center justify-center md:justify-start">
                <FaMapMarkerAlt className="mr-2" />
                Pakistan
              </p>
              <p className="mb-2 flex items-center justify-center md:justify-start">
                <FaEnvelope className="mr-2" />
                info@passwordgladiator.com
              </p>
              <p className="mb-4 flex items-center justify-center md:justify-start">
                <FaPhoneAlt className="mr-2" />
                0852-0000 9999
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto md:mx-0">
                Join Our Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

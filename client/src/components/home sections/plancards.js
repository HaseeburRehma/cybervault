import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style.css';
import { loadStripe } from '@stripe/stripe-js';
import {jwtDecode} from 'jwt-decode';

const stripePromise = loadStripe('pk_test_51PEzKBRsi1VRB1yIXCqrZLNvV2RhFj87adITBVy3ciPKKduxxhwQnFXlt8ujlN2zL9J149AVumcpSdNX2BDrKWRb005DHG1EfD');

const FeaturePoint = ({ text }) => (
  <li className="flex items-center mb-2 ml-5">
    <FaCheck className="mr-2" />
    <span>{text}</span>
  </li>
);

const plans = {
  Personal: [
    {
      title: "Basic",
      description: "Ideal for individuals",
      price: "3.00",
      Time: '1 month',
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    },
    {
      title: "Silver",
      description: "Advanced features for Personal use",
      price: "9.99",
      Time: "5 month",
      features: ["Feature 5", "Feature 6", "Feature 7", "Feature 8"],
    },
    {
      title: "Gold",
      description: "Complete Personal package",
      price: "19.99",
      Time: "Year",
      features: ["Feature 9", "Feature 10", "Feature 11", "Feature 12"],
    }
  ],
  Team: [
    {
      title: "Platinum",
      description: "Perfect for small Teams",
      price: "29.99",
      Time: "month",
      features: ["Feature 13", "Feature 14", "Feature 15", "Feature 16"],
    },
    {
      title: "Premium",
      description: "Advanced features for Teams",
      price: "49.99",
      Time: "3 month",
      features: ["Feature 17", "Feature 18", "Feature 19", "Feature 20"],
    }
  ],
  trial: [
    {
      title: "Free Trial",
      description: "Explore all features",
      price: "Free for 30 days",
      features: ["Feature 21", "Feature 22", "Feature 23", "Feature 24"]
    }
  ]
};

const FeaturedPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState('Personal');
  const [isSwitching, setIsSwitching] = useState(false);
  const [cards, setCards] = useState(plans.Personal);

  useEffect(() => {
    AOS.init();
  }, []);

  const handlePlanChange = (plan) => {
    if (selectedPlan !== plan) {
      setIsSwitching(true);
      setTimeout(() => {
        setSelectedPlan(plan);
        setCards(plans[plan]);
        setIsSwitching(false);
      }, 600);
    }
  };

  const makePayment = async (pkg) => {
    const stripe = await stripePromise;
  
    // Retrieve the token from localStorage
    const authToken = localStorage.getItem("token");
  
    if (!authToken) {
      console.error("No authentication token found.");
      return;
    }
  
    let userId;
  
    try {
      // Decode the token to get the user ID
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.id; // Extract user ID from the token
      console.log('user id ',userId);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return;
    }
  
    const body = {
      selectedPackage: pkg,
      userId: userId,
      planType: selectedPlan
    };
  
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    };
  
    try {
      const response = await fetch("http://localhost:8000/api/create-checkout-session", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });
  
      const session = await response.json();
  
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });
  
      if (result.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 font">
      <div className="relative mb-10">
        <img src='/images/helmet 1.png' alt="Helmet" className="absolute top-0 left-10 w-40 opacity-50" />
        <img src='/images/helmet 2.png' alt="Helmet" className="absolute top-0 right-10 w-40 opacity-50" />
        <h1 className="text-4xl font-bold mb-2">Our Featured Plans</h1>
        <p className="text-xl text-blue-600 mb-6">Discover our solutions</p>
        <div className="flex justify-center space-x-4 mb-1">
          <button
            className={`px-4 py-2 rounded-full border ${selectedPlan === 'Personal' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
            onClick={() => handlePlanChange('Personal')}
          >
            Personal
          </button>
          <button
            className={`px-4 py-2 rounded-full border ${selectedPlan === 'Team' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
            onClick={() => handlePlanChange('Team')}
          >
            Team
          </button>
          <button
            className={`px-4 py-2 rounded-full border ${selectedPlan === 'trial' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
            onClick={() => handlePlanChange('trial')}
          >
            Free Trial
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {cards.map((pkg, index) => (
          <div
            key={index}
            className={`card bg-gradient-to-b from-gray-700 to-blue-900 rounded-lg shadow-lg p-6 text-white w-full md:w-1/3 transition-transform duration-700 ${isSwitching ? 'rotate-card' : ''}`}
            onAnimationEnd={() => setIsSwitching(false)}
          >
            <div className="card-front">
              <h1 className="text-3xl text-white font-semibold mb-2">{pkg.title}</h1>
              <p className="mb-4 text-gray-200">{pkg.description}</p>
              <p className="text-lg font-bold mb-4">${pkg.price}/{pkg.Time}</p>
              <button className="bg-white text-blue-900 px-4 py-2 rounded-full mb-4 hover:bg-gray-200" onClick={() => makePayment(pkg)}>Get Started</button>
              <hr className="border-gray-400 mb-4" />
              <ul className="text-center ml-20 mx-auto max-w-xs">
                {pkg.features.map((feature, idx) => (
                  <FeaturePoint key={idx} text={feature} />
                ))}
              </ul>
            </div>
            <div className="card-back flex justify-center items-center">
              <img src='/images/passlogo3.png' alt='helmet' className='text-center' style={{}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPlans;

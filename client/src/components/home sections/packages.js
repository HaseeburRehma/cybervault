"use client"

import { useEffect } from "react"
import { FaCheck } from "react-icons/fa"
import "../style.css"
import AOS from "aos"
import "aos/dist/aos.css"

const FeaturePoint = ({ text }) => (
  <li className="flex items-center mb-2 ml-5">
    <FaCheck className="mr-2 text-emerald-500" />
    <span>{text}</span>
  </li>
)

const FeaturedPlans = () => {
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8 font-tomato bg-gray-100">
      <div className="relative mb-24">
        <img
          src="/images/vaultguard-icon.png"
          alt="VaultGuard Icon"
          className="absolute top-0 left-10 w-40 opacity-50"
        />
        <img
          src="/images/vaultguard-shield.png"
          alt="Security Shield"
          className="absolute top-0 right-10 w-40 opacity-50"
        />
        <h1 className="text-4xl font-bold mb-2 text-gray-800">VaultGuard Pro Plans</h1>
        <p className="text-xl text-emerald-600 mb-12">Choose your security solution</p>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <div
          className="bg-gradient-to-b from-gray-700 to-emerald-900 rounded-lg shadow-lg p-6 text-white w-full md:w-1/3"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <h1 className="text-3xl text-white font-semibold mb-2">Personal Plan</h1>
          <p className="mb-4 text-gray-200">Perfect for individuals</p>
          <p className="text-lg font-bold mb-4">Free</p>
          <button className="bg-white text-emerald-900 px-4 py-2 rounded-full mb-4 hover:bg-gray-200 transition-all duration-300">
            Get Started
          </button>
          <hr className="border-gray-400 mb-4" />
          <ul className="text-left mx-auto max-w-xs">
            <FeaturePoint text="Unlimited password storage" />
            <FeaturePoint text="Secure password generator" />
            <FeaturePoint text="Cross-device synchronization" />
            <FeaturePoint text="Basic security reports" />
            <FeaturePoint text="24/7 customer support" />
            <FeaturePoint text="Two-factor authentication" />
            <FeaturePoint text="Secure notes storage" />
            <FeaturePoint text="Emergency access" />
          </ul>
        </div>
        <div
          className="bg-gradient-to-b from-gray-700 to-emerald-900 rounded-lg shadow-lg p-6 text-white w-full md:w-1/3"
          data-aos="fade-right"
          data-aos-delay="200"
        >
          <h2 className="text-3xl text-white font-semibold mb-2">Business Plan</h2>
          <p className="mb-4 text-gray-200">Ideal for small teams</p>
          <p className="text-lg font-bold mb-4">$299/month</p>
          <button className="bg-white text-emerald-900 px-4 py-2 rounded-full mb-4 hover:bg-gray-200 transition-all duration-300">
            Get Started
          </button>
          <hr className="border-gray-400 mb-4" />
          <ul className="text-left mx-auto max-w-xs">
            <FeaturePoint text="Everything in Personal" />
            <FeaturePoint text="Team password sharing" />
            <FeaturePoint text="Admin dashboard" />
            <FeaturePoint text="Advanced security policies" />
            <FeaturePoint text="SSO integration" />
            <FeaturePoint text="Priority support" />
            <FeaturePoint text="Compliance reporting" />
            <FeaturePoint text="API access" />
          </ul>
        </div>
        <div
          className="bg-gradient-to-b from-gray-700 to-emerald-900 rounded-lg shadow-lg p-6 text-white w-full md:w-1/3"
          data-aos="fade-right"
          data-aos-delay="300"
        >
          <h2 className="text-3xl text-white font-semibold mb-2">Enterprise Plan</h2>
          <p className="mb-4 text-gray-200">For large organizations</p>
          <p className="text-lg font-bold mb-4">$799/month</p>
          <button className="bg-white text-emerald-900 px-4 py-2 rounded-full mb-4 hover:bg-gray-200 transition-all duration-300">
            Get Started
          </button>
          <hr className="border-gray-400 mb-4" />
          <ul className="text-left mx-auto max-w-xs">
            <FeaturePoint text="Everything in Business" />
            <FeaturePoint text="Advanced threat detection" />
            <FeaturePoint text="Custom security policies" />
            <FeaturePoint text="Dedicated account manager" />
            <FeaturePoint text="On-premise deployment" />
            <FeaturePoint text="Custom integrations" />
            <FeaturePoint text="Advanced analytics" />
            <FeaturePoint text="White-label options" />
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FeaturedPlans

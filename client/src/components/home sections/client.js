"use client"

import { useEffect } from "react"
import "../style.css"
import AOS from "aos"
import "aos/dist/aos.css"

const ClientsAndPartners = () => {
  useEffect(() => {
    AOS.init()
  }, [])

  const clients = [
    "Alev Digital",
    "Alev Digital",
    "Alev Digital",
    "Alev Digital",
    "Alev Digital",
    "Alev Digital",
    "Alev Digital",
    "Alev Digital",
  ]

  return (
    <div className="relative p-8 bg-white font-tomato mt-10" style={{ minHeight: "65vh" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-24" data-aos="fade-up">
          Trusted Partners & Clients
        </h2>

        {/* Animated carousel container */}
        <div className="overflow-hidden relative">
          <div className="flex animate-scroll">
            {[...clients, ...clients].map((client, index) => (
              <div key={index} className="flex-shrink-0 mx-8">
                <div className="text-2xl font-medium text-emerald-600 whitespace-nowrap bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  {client}
                </div>
              </div>
            ))}
          </div>
        </div>

        <img
          src="/images/security-pattern.png"
          alt="Security Pattern"
          className="absolute -bottom-20 right-0 w-64 h-64"
          data-aos="fade-left"
        />
      </div>
    </div>
  )
}

export default ClientsAndPartners

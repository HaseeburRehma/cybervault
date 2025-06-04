"use client"

import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import "../style.css"

const ProductDetail = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 })
  }, [])

  return (
    <div className="flex justify-center font-tomato">
      <div className="flex flex-col md:flex-row w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        {/* Block 1: Text Content */}
        <div className="relative md:w-1/2 px-24 py-32 text-emerald-600 flex flex-col justify-center">
          <h1 className="text-5xl font-normal mb-4" data-aos="fade-up">
            What is VaultGuard
            <br /> Pro?
          </h1>
          <p className="mb-4 text-gray-700" data-aos="fade-up" data-aos-delay="200">
            VaultGuard Pro is a next-generation password management solution that combines military-grade security with
            intuitive design. Our platform ensures your digital identity remains protected while providing seamless
            access across all your devices.
          </p>
          <p
            className="mb-4 text-black border-l-4 border-emerald-300 pl-4 mt-4"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            With zero-knowledge encryption and advanced threat detection, VaultGuard Pro gives you complete control over
            your digital security. Experience the peace of mind that comes with enterprise-grade protection designed for
            everyone.
          </p>
          <button
            className="w-48 border-2 border-emerald-600 text-emerald-600 px-4 py-2 rounded-full hover:text-white hover:bg-emerald-600 mt-4"
            data-aos="fade-left"
          >
            Get Started
          </button>
        </div>
        {/* Block 2: Video */}
        <div className="md:w-1/2 flex justify-center items-center">
          <video
            src="/videos/vaultguard-demo.mp4"
            autoPlay
            muted
            loop
            alt="VaultGuard Pro Demo"
            className="w-full h-full z-2 object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

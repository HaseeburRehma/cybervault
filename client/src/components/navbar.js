"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getUserDetails, logout } from "./Api_integration/userApi"
import { FaUserCircle } from "react-icons/fa"
import "./style.css"

const Navbar = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      getUserDetails(token).then((data) => {
        if (data) {
          setUser(data)
        }
      })
    }
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    navigate("/credentialform")
  }

  return (
    <nav className="bg-black bg-opacity-50 fixed shadow-lg w-full font-tomato" style={{ zIndex: "1000" }}>
      <div className="container mx-auto flex justify-between font-semibold text-lg items-center text-white">
        <div className="flex items-center">
          <img
            src="/images/navlogo.png"
            alt="VaultGuard Logo"
            className="bg--800 bg--70 rounded-xl"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
        <div className="flex space-x-8">
          <div className="relative group">
            <Link to="/" className="hover:text-emerald-400 nav-link">
              Home
            </Link>
          </div>
          <div className="relative group">
            <Link to="/plans" className="hover:text-emerald-300">
              Our Plans
            </Link>
            <div className="absolute hidden text-sm group-hover:block bg-black bg-opacity-50 shadow-lg py-2 w-60">
              <Link to="/plans" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Personal
              </Link>
              <Link to="/plans" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Business
              </Link>
            </div>
          </div>
          <div className="relative group">
            <Link to="" className="hover:text-emerald-300">
              Our Product
            </Link>
            <div className="absolute hidden text-sm group-hover:block bg-black bg-opacity-50 shadow-lg py-2 w-60">
              <Link to="/passwordvault" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Secure Vault
              </Link>
              <Link to="/passwordgenerator" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Password Generator
              </Link>
              <Link to="/autofill" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Smart Autofill
              </Link>
            </div>
          </div>
          <div className="relative group">
            <Link to="/features" className="hover:text-emerald-300">
              Advanced Features
            </Link>
            <div className="absolute hidden text-sm group-hover:block bg-black bg-opacity-50 shadow-lg py-2 w-60">
              <Link to="/features/sharing" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Secure Sharing
              </Link>
              <Link to="/features/admin" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Admin Dashboard
              </Link>
              <Link to="/features/sso" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Single Sign-On
              </Link>
              <Link to="/features/mfa" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Multi-Factor Auth
              </Link>
            </div>
          </div>
          <div className="relative group">
            <Link to="/support" className="hover:text-emerald-300">
              Support
            </Link>
            <div className="absolute hidden text-sm font-bold group-hover:block bg-black bg-opacity-50 shadow-lg py-2 w-60">
              <Link to="/support/help" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Help Center
              </Link>
              <Link to="/support/resources" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Resources
              </Link>
              <Link to="/support/trust" className="block px-4 py-2 text-gray-200 hover:text-emerald-400 nav-link">
                Trust Center
              </Link>
            </div>
          </div>
        </div>
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <FaUserCircle className="text-4xl -mr-2 inline" />
              <Link to="/userProfile" className="hover:text-emerald-300 capitalize">
                {user.username} Profile
              </Link>
              <button onClick={handleLogout} className="hover:text-emerald-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/credentialform" className="hover:text-emerald-300">
                Log In
              </Link>
              <Link
                to="/credentialform"
                className="hover:text-emerald-300 hover:border-b-0 hover:text-lg text-white border-b-2 border-emerald-300 text-xl"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

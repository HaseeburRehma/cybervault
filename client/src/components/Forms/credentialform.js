"use client"

import { useState } from "react"
import "./form.css"
import LoginForm from "./loginform"
import RegistrationForm from "./registrationfrom"

function CredentialForm() {
  const [isSignUp, setIsSignUp] = useState(false)

  const handleToggle = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <div className="login-component font-tomato">
      <div className={`container ${isSignUp ? "active" : ""}`}>
        <RegistrationForm />
        <LoginForm />
        <div className="toggle-container">
          <div className="toggle">
            <div className={`toggle-panel toggle-left ${isSignUp ? "" : "active"}`}>
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
              <p className="font-bold text-medium mt-10">Enter your credentials to access VaultGuard Pro</p>
              <button className="border-2 border-white" onClick={handleToggle}>
                Log In
              </button>
            </div>
            <div className={`toggle-panel toggle-right ${isSignUp ? "active" : ""}`}>
              <h1 className="text-3xl font-bold">WELCOME TO VaultGuard Pro</h1>
              <p className="font-bold text-medium mt-10">Create your account to secure your digital life</p>
              <button className="border-2 border-slate-300" onClick={handleToggle}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CredentialForm

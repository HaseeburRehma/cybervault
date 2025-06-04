"use client"

import { useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

const faqData = [
  {
    question: "Why choose VaultGuard Pro?",
    answer:
      "VaultGuard Pro eliminates password frustration and provides peace of mind for your digital security. Our solution works seamlessly across all devices and platforms, offering enterprise-grade security with user-friendly design.",
  },
  {
    question: "How secure are my passwords with VaultGuard Pro?",
    answer:
      "VaultGuard Pro uses military-grade AES-256 encryption and zero-knowledge architecture, ensuring that only you can access your data. We never store your master password or have access to your vault contents.",
  },
  {
    question: "How does the free trial work?",
    answer:
      "Our free trial gives you full access to VaultGuard Pro's premium features for 30 days, with no credit card required. Experience unlimited password storage, secure sharing, and advanced security features.",
  },
  {
    question: "How does VaultGuard Pro compare to other password managers?",
    answer:
      "VaultGuard Pro offers superior security, intuitive design, and advanced features like biometric authentication, secure document storage, and intelligent password analysis - all at competitive pricing.",
  },
  {
    question: "What's the difference between Free and Premium plans?",
    answer:
      "Premium plans include unlimited password storage, priority support, advanced sharing options, security reports, and team management features for business users.",
  },
  {
    question: "Which payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and enterprise billing options for business customers.",
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg font-tomato mt-10">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
      {faqData.map((item, index) => (
        <div key={index} className="mb-4 border border-gray-200 rounded-lg">
          <div
            className="flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-t-lg cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
            {openIndex === index ? (
              <FaChevronUp className="text-emerald-600" />
            ) : (
              <FaChevronDown className="text-emerald-600" />
            )}
          </div>
          {openIndex === index && (
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
              <p className="text-gray-700">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default FAQ

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I create an account?",
      answer: "Creating an account is simple! Click on the 'Sign Up' button in the top right corner, fill in your email address and create a secure password. You'll receive a verification email to activate your account.",
    },
    {
      id: 2,
      question: "How can I reset my password?",
      answer: "If you've forgotten your password, go to the login page and click 'Forgot Password'. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to set a new password.",
    },
    {
      id: 3,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and for annual subscriptions, we also support bank transfers. All transactions are securely processed.",
    },
    {
      id: 4,
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from your account dashboard under 'Billing Settings'. Your cancellation will take effect at the end of your current billing cycle, and you'll retain access until then.",
    },
    {
      id: 5,
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 14-day free trial on all our plans. No credit card is required to start the trial. You'll get full access to all features to explore the platform before committing.",
    },
    {
      id: 6,
      question: "How do I contact customer support?",
      answer: "You can reach our support team 24/7 by emailing support@example.com or using the live chat widget on our website. We typically respond within a few hours during business days.",
    },
  ];

  const toggleFaq = (id) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Help & Support
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-2">
            Find answers to frequently asked questions. Can't find what you're looking for? Reach out to our support team.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 text-center">
            Frequently Asked Questions
          </h2>
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden transition-all duration-200 hover:border-gray-700"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-inset"
                aria-expanded={openIndex === faq.id}
              >
                <span className="text-base sm:text-lg font-medium text-white pr-6 sm:pr-8 break-words flex-1">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 ml-3 sm:ml-4 text-yellow-400 text-xl sm:text-2xl">
                  {openIndex === faq.id ? '−' : '+'}
                </span>
              </button>
              {openIndex === faq.id && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-gray-300 border-t border-gray-800">
                  <p className="text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support CTA Section */}
        <div className="mt-12 sm:mt-16 text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
            Our support team is here to help you.
          </p>
          <Link
            to="/contact-us"
            className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-yellow-400 text-gray-900 font-medium text-sm sm:text-base hover:bg-yellow-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#0B0B0F]"
          >
            Contact Support
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
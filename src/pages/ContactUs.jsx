import React, { useEffect, useRef } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaPaperPlane , FaCheckCircle } from 'react-icons/fa';
import gsap from 'gsap';

const ContactUs = () => {
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    // Simple initial animations - lightweight
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
    
    if (infoRef.current) {
      gsap.fromTo(infoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
      );
    }
    
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
      );
    }
  }, []);

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email Us",
      details: ["support@smartx.com", "hello@smartx.com"],
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: FaPhoneAlt,
      title: "Call Us",
      details: ["+91 4051234567", "+1 (555) 987-6543"],
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      details: ["123 Marketplace Ave", "Mumbai India, MH 94105"],
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: FaClock,
      title: "Support Hours",
      details: ["Monday - Friday: 9AM - 6PM", "Saturday: 10AM - 4PM", "Sunday: Closed"],
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook", color: "hover:text-blue-500" },
    { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
    { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:text-pink-500" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert("Thank you for reaching out! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-6xl">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
            Contact Us
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className={`${info.bgColor} border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-200`}
            >
              <info.icon className={`${info.color} text-2xl mb-3`} />
              <h3 className="font-semibold text-white mb-2">{info.title}</h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-400 text-sm leading-relaxed">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Contact Form & Map Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div ref={formRef} className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
            <p className="text-gray-400 text-sm mb-6">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="How can we help you?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows="5"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaPaperPlane size={16} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info & Map Placeholder */}
          <div ref={infoRef} className="space-y-6">
            {/* Quick Response Note */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 text-xl mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Quick Response Time</h3>
                  <p className="text-gray-400 text-sm">
                    We typically respond within 24 hours during business days. For urgent issues, please call our support line.
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-gray-800/50 h-48 flex items-center justify-center">
                <div className="text-center">
                  <FaMapMarkerAlt className="text-blue-400 text-3xl mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">San Francisco, CA</p>
                  <p className="text-gray-500 text-xs mt-1">Interactive map would load here</p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-800">
                <p className="text-gray-400 text-sm text-center">
                  📍 123 Marketplace Avenue, San Francisco, CA 94105
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4 text-center">Connect With Us</h3>
              <div className="flex justify-center gap-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`text-gray-400 ${social.color} transition-colors duration-200`}
                    aria-label={social.label}
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>
              <p className="text-gray-500 text-xs text-center mt-4">
                Follow us for updates, tips, and community news
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="mt-12 text-center">
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-sm">
              Frequently asked questions? Check out our <button className="text-blue-400 hover:text-blue-300 transition-colors">Help Center</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
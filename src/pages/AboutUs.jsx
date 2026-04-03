import React, { useEffect, useRef } from 'react';
import { FaShieldAlt, FaHandshake, FaRocket, FaStore, FaPaperPlane, FaUserFriends, FaCheckCircle, FaComments, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import gsap from 'gsap';

const AboutUs = () => {
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Simple initial animation - only runs once on mount
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
    
    // Simple stagger for cards
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, delay: index * 0.1, ease: "power2.out" }
        );
      }
    });
  }, []);

  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const features = [
    {
      icon: FaStore,
      title: "Local Marketplace",
      description: "Buy and sell items within your community. Connect with people nearby for quick and easy transactions.",
      iconColor: "text-blue-400"
    },
    {
      icon: FaUserFriends,
      title: "Community Driven",
      description: "Join a growing community of local buyers and sellers. Rate and review to build trust.",
      iconColor: "text-purple-400"
    },
    {
      icon: FaRocket,
      title: "Simple & Fast",
      description: "List items in seconds. No complicated forms or hidden fees. Just straightforward local commerce.",
      iconColor: "text-green-400"
    }
  ];

  const safetyFeatures = [
    {
      icon: FaComments,
      title: "In-app Messaging",
      description: "Keep conversations private and secure"
    },
    {
      icon: FaStar,
      title: "Ratings & Reviews",
      description: "Build trust through transparent feedback"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Safe Meeting Tips",
      description: "Guidelines for secure local transactions"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-6xl">
        
        {/* Header - Simple fade in */}
        <div ref={headerRef} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
            About Smart<p className='text-6xl text-yellow-400 inline-block xLogo'>X</p>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Your trusted local marketplace for buying and selling with confidence
          </p>
        </div>

        {/* Our Purpose - No animation, just clean HTML/CSS */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full mb-4">
              <FaRocket className="text-blue-400 text-sm" />
              <span className="text-blue-200 text-sm font-medium">Our Purpose</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Empowering Local Commerce
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              SmartX was born with a simple vision: <span className="text-white font-medium">make local buying and selling effortless</span>. 
              We believe in connecting neighbors, reducing waste, and creating a trusted space where anyone can turn unused items into cash, 
              or find great deals just around the corner.
            </p>
            <div className="mt-5 flex items-center gap-2 text-gray-400 text-sm">
              <FaCheckCircle className="text-green-500 text-sm" />
              <span>Join thousands of satisfied users</span>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <FaStore className="text-yellow-500 text-6xl sm:text-7xl" />
            </div>
          </div>
        </div>

        {/* Safety Section - Clean and fast loading */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full mb-4">
              <FaShieldAlt className="text-green-400 text-sm" />
              <span className="text-green-400 text-sm font-medium">Stay Safe</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Connect with Confidence
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-5">
              Your safety is our priority. We've built SmartX with <span className="text-white font-medium">powerful safety features</span> to help you connect securely.
            </p>
            <div className="space-y-4">
              {safetyFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <feature.icon className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center order-1 md:order-2">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <FaShieldAlt className="text-green-400 text-6xl sm:text-7xl" />
            </div>
          </div>
        </div>

        {/* Trust & Simplicity Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-full mb-4">
            <FaHandshake className="text-purple-400 text-sm" />
            <span className="text-purple-400 text-sm font-medium">Our Promise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trust & Simplicity, Always
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We believe in <span className="text-white font-medium">radical simplicity</span>. No complicated processes, no hidden agendas. 
            Just a clean, intuitive platform that makes local buying and selling a breeze.
          </p>
        </div>

        {/* Features Cards - Simple grid with no heavy animations */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={addToCardsRef}
              className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 hover:border-gray-700 hover:bg-gray-900/60 transition-all duration-200"
            >
              <div className={`${feature.iconColor} mb-4`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Simple CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl p-6 sm:p-8 border border-gray-800">
            <FaHandshake className="text-blue-400 text-3xl mx-auto mb-3" />
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to get started?</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Join SmartX today — simple, safe, and community-focused.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
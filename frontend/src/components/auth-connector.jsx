"use client";
import React, { useState } from "react";
import SignupFormDemo from "./signup-form-demo";
import SigninFormDemo from "./signin-form-demo";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthConnector() {
  const [showSignin, setShowSignin] = useState(true);
  
  const toggleForm = () => {
    setShowSignin(!showSignin);
  };

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center p-8">
      <AnimatePresence mode="wait">
        {showSignin ? (
          <motion.div
            key="signin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <SigninFormDemo onSwitchToSignup={toggleForm} />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <SignupFormDemo onSwitchToSignin={toggleForm} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
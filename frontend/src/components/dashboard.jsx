import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ThreeDMarquee } from './ui/3d-marquee';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { GlowingEffect } from './ui/glowing-effect';
import ColourfulText from './ui/colourful-text';
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from './ui/text-reveal-card';
import DashboardLayout from './layout/DashboardLayout';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Construction project images - using high-quality construction images
  const constructionImages = [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=800&q=80",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
    "https://images.unsplash.com/photo-1612363653191-1b36ef4dda2f?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.unsplash.com/photo-1523192193543-6e7296d960e4?w=800&q=80",
    "https://images.unsplash.com/photo-1560748952-1d2d768c2337?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  
    "https://images.unsplash.com/photo-1478486982180-2de2fafa19f9?w=800&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    "https://images.unsplash.com/photo-1622915904739-efd69cd8c519?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  // workers on scaffolding 
    "https://images.unsplash.com/photo-1714736834706-7e9dba1da6cb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  // heavy machinery & site 
    "https://images.unsplash.com/photo-1521790361543-f645cf042ec4?w=800&q=80",
    "https://plus.unsplash.com/premium_photo-1661962468079-5d6791f9c627?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  // concrete pour with workers 
    "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=800&q=80",
  ];
  

  return (
    <DashboardLayout>
      {/* Adding a wrapper div with relative positioning */}
      <div className="relative overflow-hidden w-full h-full">
        {/* 3D Marquee as Background Layer */}
        <div className="absolute inset-0 w-full min-h-screen bg-neutral-50/50 dark:bg-zinc-900/50">
          {/* The key changes are here - explicit positioning and increased visibility */}
          <div className="absolute top-0 left-0 right-0 bottom-0 transform scale-110">
            <ThreeDMarquee 
              images={constructionImages}
              isBackground={true}
              className="opacity-20 dark:opacity-15"
            />
          </div>
          
          {/* Gradient overlay to help with text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-50/80 to-neutral-50/90 dark:from-transparent dark:via-zinc-900/80 dark:to-zinc-900/90 z-0"></div>
        </div>
        
        {/* Content Layer */}
        <div className="relative z-10 p-8 pt-6">
          <div className="max-w-6xl mx-auto">
            {/* Header with Colorful Text */}
            <div className="text-center mb-12 mt-8">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ColourfulText text={`Welcome, ${user?.first_name || 'User'}`} />
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-400 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Your AI-powered construction management platform
              </motion.p>
            </div>

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CardContainer containerClassName="py-8">
                <CardBody className="relative w-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-8">
                  <CardItem translateZ={20}>
                    <h2 className="text-2xl font-bold dark:text-white">Dashboard Overview</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-3">
                      View and manage your construction projects with AI-powered insights
                    </p>
                  </CardItem>
                  
                  <CardItem translateZ={40} className="mt-6">
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                      Select a project from the Projects page to see detailed information
                    </p>
                  </CardItem>
                  
                  <GlowingEffect disabled={false} borderWidth={1.5} />
                </CardBody>
              </CardContainer>
            </motion.div>
            
            {/* Text Reveal Card */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <TextRevealCard 
                text="Optimize Construction" 
                revealText="With AI Intelligence"
                className="w-full h-auto bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md"
              >
                <TextRevealCardTitle>
                  Construction Management Platform
                </TextRevealCardTitle>
                <TextRevealCardDescription>
                  Streamline your construction projects with advanced AI tools for planning, monitoring, and optimization. 
                  Hover over this card to see what our platform can do for you.
                </TextRevealCardDescription>
              </TextRevealCard>
            </motion.div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {['Projects', 'Teams', 'Analytics'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                >
                  <CardContainer>
                    <CardBody className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
                      <CardItem translateZ={20}>
                        <h3 className="text-xl font-semibold dark:text-white">{item}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                          Access your {item.toLowerCase()} and key information
                        </p>
                      </CardItem>
                      <GlowingEffect disabled={false} borderWidth={1} spread={15} />
                    </CardBody>
                  </CardContainer>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
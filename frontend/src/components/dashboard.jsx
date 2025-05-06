import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ThreeDMarquee } from './ui/3d-marquee';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { GlowingEffect } from './ui/glowing-effect';
import DashboardLayout from './layout/DashboardLayout';
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Sample construction project images for the 3D marquee
  const constructionImages = [
    "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=1887&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1770&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1770&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521722653860-5ea0a7a8b40c?q=80&w=1770&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1474649107449-ea4f014b7e9f?q=80&w=1770&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1770&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513467655676-561b7d489a88?q=80&w=1932&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?q=80&w=1974&auto=format&fit=crop"
  ];

  return (
    <DashboardLayout>
      <div className="p-8 pt-6">
        <div className="max-w-6xl mx-auto">
          {/* Header and Welcome */}
          <CardContainer containerClassName="py-8">
            <CardBody className="relative w-full bg-white dark:bg-zinc-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-8">
              <CardItem translateZ={20}>
                <h1 className="text-3xl font-bold dark:text-white">Welcome, {user?.first_name || 'User'}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
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
          
          {/* 3D Marquee */}
          <div className="mt-8 max-w-full overflow-hidden">
              <h2 className="text-xl font-semibold dark:text-white mb-6">Featured Construction Projects</h2>
              <div className="relative h-[500px] w-full">
                <ThreeDMarquee images={constructionImages} className="h-[500px]" />
              </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
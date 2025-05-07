import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ThreeDMarquee } from './ui/3d-marquee';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { GlowingEffect } from './ui/glowing-effect';
import ColourfulText from './ui/colourful-text';
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from './ui/text-reveal-card';
import DashboardLayout from './layout/DashboardLayout';
import { motion } from 'framer-motion';
import { IconBuilding, IconUsers, IconChartBar, IconAlertTriangle } from '@tabler/icons-react';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Construction project images - expanded list
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
    "https://images.unsplash.com/photo-1622915904739-efd69cd8c519?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1714736834706-7e9dba1da6cb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1521790361543-f645cf042ec4?w=800&q=80",
    "https://plus.unsplash.com/premium_photo-1661962468079-5d6791f9c627?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=800&q=80",
  ];

  // Stats for dashboard cards
  const stats = [
    { 
      title: 'Active Projects', 
      value: '12', 
      change: '+2',
      color: 'bg-blue-500',
      icon: <IconBuilding className="h-5 w-5 text-blue-600 dark:text-blue-400" /> 
    },
    { 
      title: 'Team Members', 
      value: '48', 
      change: '+5',
      color: 'bg-purple-500',
      icon: <IconUsers className="h-5 w-5 text-purple-600 dark:text-purple-400" /> 
    },
    { 
      title: 'Issues', 
      value: '7', 
      change: '-3',
      color: 'bg-amber-500',
      icon: <IconAlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" /> 
    },
    { 
      title: 'Completion Rate', 
      value: '76%', 
      change: '+4%',
      color: 'bg-emerald-500',
      icon: <IconChartBar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> 
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col h-screen overflow-auto">
        {/* Hero section with larger heading */}
        <div className="bg-gradient-to-b from-blue-50/50 to-neutral-50 dark:from-blue-950/20 dark:to-zinc-900 py-12 px-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
              Welcome, <ColourfulText text={user?.first_name || 'User'} />
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400">
              Your AI-powered construction management platform
            </p>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-neutral-900 p-6">
          {/* Stats Cards */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700">
                      {stat.icon}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stat.change.startsWith('+') 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{stat.title}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Project Showcase - Styled like the example */}
            <motion.div 
  className="mb-12"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
>
  <h2 className="text-2xl font-bold dark:text-white mb-4">Project Showcase</h2>
  <div className="mx-auto rounded-3xl bg-gray-950/5 dark:bg-neutral-800/20 px-4 pt-0 pb-4 ring-1 ring-neutral-700/10 dark:ring-white/5 overflow-hidden">
    <div className="h-[600px] -mt-6">
      <ThreeDMarquee images={constructionImages} />
    </div>
  </div>
</motion.div>
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                {/* Text Reveal Card */}
                <CardContainer containerClassName="mb-6">
                  <CardBody className="w-full bg-neutral-900 rounded-xl p-6 text-white">
                    <TextRevealCard 
                      text="Optimize Construction" 
                      revealText="With AI Intelligence"
                      className="w-full border-none bg-transparent p-0"
                    >
                      <TextRevealCardTitle>
                        AI-Powered Construction Management
                      </TextRevealCardTitle>
                      <TextRevealCardDescription>
                        Streamline your construction projects with advanced AI tools for planning, 
                        monitoring, and optimization. Hover over this card to see what our platform can do for you.
                      </TextRevealCardDescription>
                    </TextRevealCard>
                  </CardBody>
                </CardContainer>
                
                {/* Project Overview Card */}
                <CardContainer>
                  <CardBody className="relative w-full bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
                    <CardItem translateZ={20}>
                      <h2 className="text-lg font-semibold dark:text-white">Project Overview</h2>
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Project Alpha</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">78%</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Project Beta</span>
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">45%</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Project Gamma</span>
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">92%</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardItem>
                    
                    <CardItem translateZ={40} className="mt-6">
                      <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                        View detailed project progress in the Projects section
                      </p>
                    </CardItem>
                    
                    <GlowingEffect disabled={false} borderWidth={1.5} />
                  </CardBody>
                </CardContainer>
              </div>
              
              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Notifications Card */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">
                  <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Updates</h2>
                  <div className="space-y-4">
                    {[
                      { title: 'Project Alpha materials delivered', time: '2 hours ago' },
                      { title: 'Safety inspection scheduled', time: '5 hours ago' },
                      { title: 'Milestone completed on Project Beta', time: 'Yesterday' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 pb-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0 last:pb-0">
                        <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500"></div>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-800 dark:text-neutral-200">{item.title}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Quick Actions Card */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">
                  <h2 className="text-lg font-semibold mb-4 dark:text-white">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: 'New Project', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
                      { title: 'Schedule', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
                      { title: 'Reports', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
                      { title: 'Team', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' },
                    ].map((action, index) => (
                      <button key={index} className={`p-3 rounded-lg ${action.color} text-xs font-medium`}>
                        {action.title}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Weekly Schedule Card */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">
                  <h2 className="text-lg font-semibold mb-4 dark:text-white">Upcoming</h2>
                  <div className="space-y-3">
                    {[
                      { day: 'Today', event: 'Safety Meeting', time: '2:00 PM' },
                      { day: 'Tomorrow', event: 'Site Inspection', time: '10:00 AM' },
                      { day: 'Friday', event: 'Project Review', time: '1:30 PM' },
                    ].map((event, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700/50">
                        <div>
                          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{event.day}</p>
                          <p className="text-sm font-medium dark:text-white">{event.event}</p>
                        </div>
                        <span className="text-xs bg-white dark:bg-neutral-800 px-2 py-1 rounded text-neutral-600 dark:text-neutral-400">
                          {event.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
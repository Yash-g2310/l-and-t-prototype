import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sidebar, 
  SidebarBody, 
  SidebarLink 
} from './ui/sidebar';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { GlowingEffect } from './ui/glowing-effect';
import { ThreeDMarquee } from './ui/3d-marquee';
import { 
  IconHome, 
  IconUser, 
  IconSettings,
  IconBriefcase,
  IconCalendar,
  IconUsers,
  IconLogout,
  IconChartBar,
  IconBuildingSkyscraper,
  IconAlertTriangle,
  IconClock,
  IconArrowUpRight,
  IconArrowDownRight,
  IconExternalLink,
  IconCircleCheck,
  IconListCheck,
  IconBuildingCommunity,
  IconToolsKitchen2,
  IconChartPie
} from '@tabler/icons-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Define sidebar navigation links
  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: <IconHome className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Projects', href: '/projects', icon: <IconBriefcase className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Schedule', href: '/schedule', icon: <IconCalendar className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Team', href: '/team', icon: <IconUsers className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Analytics', href: '/analytics', icon: <IconChartPie className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Profile', href: '/profile', icon: <IconUser className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Settings', href: '/settings', icon: <IconSettings className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
  ];

  // Fetch project data
  useEffect(() => {
    // In a real app, you'd fetch from your API
    // Example: fetch('/api/projects')
    // For now, using mock data
    const mockData = {
      activeProjects: 12,
      tasksCompleted: 48,
      pendingIssues: 7,
      hoursLogged: 164,
      projectsData: [
        { name: "Highway Extension Phase 2", progress: 75, status: "On Track" },
        { name: "Downtown Renovation", progress: 32, status: "Delayed" },
        { name: "Riverside Bridge", progress: 89, status: "On Track" },
        { name: "Commercial Complex", progress: 45, status: "At Risk" },
      ],
      tasks: [
        { task: "Submit progress report", date: "Today", urgent: true },
        { task: "Client meeting", date: "Tomorrow, 10:00 AM", urgent: false },
        { task: "Review site safety", date: "May 8, 2025", urgent: false },
        { task: "Material delivery", date: "May 10, 2025", urgent: true },
      ]
    };
    
    setTimeout(() => {
      setProjectData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-zinc-900">
      {/* Sidebar */}
      <Sidebar>
        <SidebarBody>
          {/* Logo or Brand */}
          <div className="flex items-center mb-6 px-2">
            <span className="text-xl font-bold dark:text-white">Construction AI</span>
          </div>
          
          {/* Navigation Links */}
          <div className="space-y-2">
            {navLinks.map((link) => (
              <SidebarLink key={link.href} link={link} />
            ))}
          </div>
          
          {/* User Info and Logout at Bottom */}
          <div className="mt-auto pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center px-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mr-2 text-white font-medium">
                {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <div className="text-sm dark:text-neutral-300">
                <div>{user?.first_name} {user?.last_name}</div>
                <div className="text-xs text-neutral-500">{user?.role}</div>
              </div>
            </div>
            <SidebarLink 
              link={{
                label: 'Logout',
                href: '#',
                icon: <IconLogout className="h-5 w-5 text-red-500" />
              }}
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
              className="text-red-500"
            />
          </div>
        </SidebarBody>
      </Sidebar>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Header and Welcome */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">Welcome, {user?.first_name || 'User'}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Here's what's happening with your projects today</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: Today at 9:41 AM</span>
              <button className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                Refresh
              </button>
            </div>
          </div>
          
          {/* Featured Project Marquee */}
          <div className="mb-10 -mt-2">
            <h2 className="text-lg font-semibold dark:text-white mb-4">Featured Projects</h2>
            <ThreeDMarquee images={constructionImages} className="h-[400px]" />
          </div>
          
          {/* 3D Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Project Overview 3D Card */}
            <CardContainer containerClassName="py-0">
              <CardBody className="relative h-auto w-full p-6 bg-white dark:bg-zinc-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="relative">
                  <CardItem
                    translateZ={50}
                    className="flex items-center justify-between"
                  >
                    <div className="text-2xl font-bold text-black dark:text-white">
                      {loading ? '-' : projectData?.activeProjects}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <IconBuildingSkyscraper className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </CardItem>
                  
                  <CardItem
                    as="p"
                    translateZ={30}
                    className="text-neutral-500 dark:text-neutral-300 text-sm mt-2"
                  >
                    Active Projects
                  </CardItem>
                  
                  <CardItem
                    translateZ={60}
                    className="flex items-center mt-3 text-green-600 dark:text-green-400 text-sm font-medium"
                  >
                    <IconArrowUpRight className="h-4 w-4 mr-1" /> 
                    <span>8.2% from last month</span>
                  </CardItem>
                </div>
                <GlowingEffect disabled={false} borderWidth={1.5} blur={20} spread={40} />
              </CardBody>
            </CardContainer>

            {/* Tasks Completed 3D Card */}
            <CardContainer containerClassName="py-0">
              <CardBody className="relative h-auto w-full p-6 bg-white dark:bg-zinc-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="relative">
                  <CardItem
                    translateZ={50}
                    className="flex items-center justify-between"
                  >
                    <div className="text-2xl font-bold text-black dark:text-white">
                      {loading ? '-' : projectData?.tasksCompleted}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <IconListCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </CardItem>
                  
                  <CardItem
                    as="p"
                    translateZ={30}
                    className="text-neutral-500 dark:text-neutral-300 text-sm mt-2"
                  >
                    Tasks Completed
                  </CardItem>
                  
                  <CardItem
                    translateZ={60}
                    className="flex items-center mt-3 text-green-600 dark:text-green-400 text-sm font-medium"
                  >
                    <IconArrowUpRight className="h-4 w-4 mr-1" /> 
                    <span>12.5% from last month</span>
                  </CardItem>
                </div>
                <GlowingEffect disabled={false} borderWidth={1.5} blur={20} spread={40} />
              </CardBody>
            </CardContainer>

            {/* Issues 3D Card */}
            <CardContainer containerClassName="py-0">
              <CardBody className="relative h-auto w-full p-6 bg-white dark:bg-zinc-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="relative">
                  <CardItem
                    translateZ={50}
                    className="flex items-center justify-between"
                  >
                    <div className="text-2xl font-bold text-black dark:text-white">
                      {loading ? '-' : projectData?.pendingIssues}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <IconAlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </CardItem>
                  
                  <CardItem
                    as="p"
                    translateZ={30}
                    className="text-neutral-500 dark:text-neutral-300 text-sm mt-2"
                  >
                    Pending Issues
                  </CardItem>
                  
                  <CardItem
                    translateZ={60}
                    className="flex items-center mt-3 text-red-600 dark:text-red-400 text-sm font-medium"
                  >
                    <IconArrowDownRight className="h-4 w-4 mr-1" /> 
                    <span>3.1% from last month</span>
                  </CardItem>
                </div>
                <GlowingEffect disabled={false} borderWidth={1.5} blur={20} spread={40} />
              </CardBody>
            </CardContainer>

            {/* Hours Logged 3D Card */}
            <CardContainer containerClassName="py-0">
              <CardBody className="relative h-auto w-full p-6 bg-white dark:bg-zinc-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="relative">
                  <CardItem
                    translateZ={50}
                    className="flex items-center justify-between"
                  >
                    <div className="text-2xl font-bold text-black dark:text-white">
                      {loading ? '-' : projectData?.hoursLogged}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <IconClock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </CardItem>
                  
                  <CardItem
                    as="p"
                    translateZ={30}
                    className="text-neutral-500 dark:text-neutral-300 text-sm mt-2"
                  >
                    Hours Logged
                  </CardItem>
                  
                  <CardItem
                    translateZ={60}
                    className="flex items-center mt-3 text-green-600 dark:text-green-400 text-sm font-medium"
                  >
                    <IconArrowUpRight className="h-4 w-4 mr-1" /> 
                    <span>4.7% from last month</span>
                  </CardItem>
                </div>
                <GlowingEffect disabled={false} borderWidth={1.5} blur={20} spread={40} />
              </CardBody>
            </CardContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Progress */}
            <CardContainer containerClassName="py-0 lg:col-span-2">
              <CardBody className="relative h-auto w-full bg-white dark:bg-zinc-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="relative p-6">
                  <CardItem
                    translateZ={50}
                    className="flex justify-between items-center mb-4"
                  >
                    <h2 className="text-lg font-semibold dark:text-white">Active Projects</h2>
                    <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                      View All
                      <IconExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </CardItem>
                  
                  <div className="space-y-4">
                    {loading ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-16 bg-gray-200 dark:bg-zinc-700 rounded-lg"></div>
                        ))}
                      </div>
                    ) : (
                      projectData?.projectsData.map((project, idx) => (
                        <CardItem key={idx} translateZ={40 - idx * 5} className="block w-full">
                          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-zinc-700/40 hover:bg-gray-100 dark:hover:bg-zinc-700/60 transition-colors">
                            <div className="flex-1">
                              <h3 className="font-medium dark:text-white">{project.name}</h3>
                              <div className="flex items-center mt-1">
                                <div className="h-2 w-36 bg-gray-200 dark:bg-zinc-600 rounded overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      project.status === "On Track" ? "bg-green-500" :
                                      project.status === "At Risk" ? "bg-amber-500" : "bg-red-500"
                                    }`} 
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{project.progress}%</span>
                              </div>
                            </div>
                            <span className={`text-sm px-2.5 py-1 rounded-full ${
                              project.status === "On Track" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                              project.status === "At Risk" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : 
                              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </CardItem>
                      ))
                    )}
                  </div>
                </div>
                <GlowingEffect disabled={false} borderWidth={1.5} />
              </CardBody>
            </CardContainer>
            
            {/* Upcoming Tasks */}
            <CardContainer containerClassName="py-0">
              <CardBody className="relative h-auto w-full bg-white dark:bg-zinc-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="relative p-6">
                  <CardItem
                    translateZ={50}
                    className="flex justify-between items-center mb-4"
                  >
                    <h2 className="text-lg font-semibold dark:text-white">Upcoming Tasks</h2>
                    <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                      View All
                      <IconExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </CardItem>
                  
                  <div className="space-y-2">
                    {loading ? (
                      <div className="animate-pulse space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-12 bg-gray-200 dark:bg-zinc-700 rounded-lg"></div>
                        ))}
                      </div>
                    ) : (
                      projectData?.tasks.map((task, idx) => (
                        <CardItem key={idx} translateZ={40 - idx * 5} className="block w-full">
                          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700/40 transition-colors cursor-pointer">
                            <div className={`w-3 h-3 mt-1 rounded-full ${task.urgent ? "bg-red-500" : "bg-blue-500"} mr-3 flex-shrink-0`}></div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium dark:text-white truncate">{task.task}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{task.date}</p>
                            </div>
                            <IconCircleCheck className="h-5 w-5 ml-2 text-gray-400 hover:text-green-500 dark:text-gray-500 dark:hover:text-green-400 transition-colors" />
                          </div>
                        </CardItem>
                      ))
                    )}
                  </div>
                  
                  <CardItem translateZ={50} className="w-full mt-5">
                    <button className="w-full bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-medium transition-colors">
                      Add New Task
                    </button>
                  </CardItem>
                </div>
                <GlowingEffect disabled={false} borderWidth={1.5} />
              </CardBody>
            </CardContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
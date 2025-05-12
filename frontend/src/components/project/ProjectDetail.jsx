import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';
import ProjectDetailForm from './ProjectDetailForm';
import ProjectChat from './ProjectChat';
import ProjectUpdates from './ProjectUpdates';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundGradient } from '../ui/background-gradient';
import { GlowingEffect } from '../ui/glowing-effect';
import HardcodedChatbot from './chatbot';
import {
  IconInfoCircle,
  IconMessage,
  IconBell,
  IconArrowLeft,
  IconLoader2,
  IconClipboardCheck,
  IconCalendarEvent,
  IconUsers,
  IconPackage,
  IconAlertTriangle
} from '@tabler/icons-react';
import { getProject, getChatRooms } from '../../services/projectService';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../ui/resizable-navbar';
import { FloatingDock } from '../ui/floating-dock';
import { TextRevealCard } from '../ui/text-reveal-card';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainSection, setMainSection] = useState('details');
  const [subSection, setSubSection] = useState('basic');
  const [chatRoom, setChatRoom] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Keep track of manually selected section
  const mainSectionRef = useRef('details');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch project details
        console.log('Fetching project with ID:', projectId);
        const projectData = await getProject(projectId);
        setProject(projectData);
        
        // Fetch chat rooms to find the one for this project
        const chatRoomsData = await getChatRooms();
        console.log('Chat rooms received:', chatRoomsData);
        
        // Try both string and number comparison
        const projectChatRoom = chatRoomsData.find(
          room => room.project === parseInt(projectId) || room.project === projectId
        );
        
        if (projectChatRoom) {
          console.log('Found chat room:', projectChatRoom);
          setChatRoom(projectChatRoom);
        } else {
          console.warn('No chat room found for this project. Creating fallback.');
          // Create a fallback chat room object so UI doesn't break
          setChatRoom({
            id: null,
            project: parseInt(projectId)
          });
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(typeof err === 'string' ? err : 'Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // The main section navigation items
  const navItems = [
    { name: 'Project Details', link: '#details', id: 'details' },
    { name: 'AI Assistant', link: '#chat', id: 'chat' },
    { name: 'Updates', link: '#updates', id: 'updates' },
  ];

  // Sub-section items for the floating dock
  const dockItems = [
    {
      title: 'Basic Info',
      icon: <IconClipboardCheck className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#basic",
      onClick: () => setSubSection('basic')
    },
    {
      title: 'Timeline',
      icon: <IconCalendarEvent className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#timeline",
      onClick: () => setSubSection('timeline')
    },
    {
      title: 'Workers',
      icon: <IconUsers className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#workers",
      onClick: () => setSubSection('workers')
    },
    {
      title: 'Suppliers',
      icon: <IconPackage className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#suppliers",
      onClick: () => setSubSection('suppliers')
    },
    {
      title: 'Risk Analysis',
      icon: <IconAlertTriangle className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#risks",
      onClick: () => setSubSection('risks')
    }
  ];

  // Handle navigation item clicks - using reference to ensure state updates consistently
  const handleNavItemClick = useCallback((item) => {
    const sectionId = item.id || item.link.replace('#', '');
    console.log('Navigation clicked:', sectionId, 'Current:', mainSectionRef.current);
    
    // Update both the state and ref
    setMainSection(sectionId);
    mainSectionRef.current = sectionId;
    
    // Reset subsection when changing main section
    if (sectionId === 'details') {
      setSubSection('basic');
    }
    
    setIsMobileMenuOpen(false);
  }, []);

  // Get the status color class
  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-blue-600';
      case 'in_progress': return 'bg-amber-600';
      case 'completed': return 'bg-green-600';
      case 'on_hold': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  // Project logo/icon component
  const ProjectLogo = () => (
    <div className="flex items-center">
      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
        <IconInfoCircle className="h-5 w-5 text-white" />
      </div>
      <span className="font-medium text-gray-900 dark:text-white text-lg">
        {project?.title || 'Project Details'}
      </span>
    </div>
  );

  // Log state for debugging
  console.log('Current state:', {
    mainSection, 
    subSection,
    chatRoom: chatRoom ? 'Loaded' : 'Not loaded',
    chatRoomId: chatRoom?.id,
    user: user?.role
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <IconLoader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading project details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8 h-[80vh]">
          <BackgroundGradient className="p-8 rounded-2xl w-full max-w-md mb-4">
            <div className="p-4 bg-white/80 dark:bg-black/50 rounded-xl">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-3">Error Loading Project</h2>
              <p className="text-gray-800 dark:text-gray-200 mb-4">{error}</p>
              <button
                onClick={() => navigate('/projects')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full"
              >
                Return to Projects
              </button>
            </div>
          </BackgroundGradient>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8 h-[80vh]">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Project not found</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Projects
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // If worker tries to access details tab, redirect to chat
  if (user.role === 'worker' && mainSection === 'details') {
    setMainSection('chat');
    mainSectionRef.current = 'chat';
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        {/* Back button bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => navigate('/projects')}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <IconArrowLeft className="mr-2 h-5 w-5" />
              Back to Projects
            </button>
            
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${getStatusColor(project.status)} animate-pulse mr-2`}></div>
              <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-400">
                {project.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      
        {/* Resizable Navbar for top navigation */}
        <div className="relative w-full">
          <Navbar className="sticky top-0">
            {/* Desktop Navigation */}
            <NavBody>
              {/* Using TextRevealCard for fancy project title display */}
              <TextRevealCard
                text={project.title}
                revealText={project.title}
                className="bg-transparent w-auto h-16 p-0 border-none"
              >
                <div className="absolute inset-0"></div>
              </TextRevealCard>
              
              {/* Manual implementation of nav items to ensure they work */}
              <div className="flex items-center space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavItemClick(item)}
                    className={`relative py-1.5 text-sm transition focus-visible:outline-none ${
                      mainSection === item.id 
                        ? 'text-neutral-900 dark:text-neutral-100 font-medium'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300'
                    }`}
                  >
                    {item.name}
                    {mainSection === item.id && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-neutral-100"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav>
              <MobileNavHeader>
                <ProjectLogo />
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                />
              </MobileNavHeader>

              <MobileNavMenu 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)}
              >
                {navItems.map((item, idx) => (
                  <button
                    key={`mobile-nav-${idx}`}
                    onClick={() => handleNavItemClick(item)}
                    className={`flex w-full items-center p-4 transition-colors rounded-lg ${
                      mainSection === item.id
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{item.name}</span>
                  </button>
                ))}
              </MobileNavMenu>
            </MobileNav>
          </Navbar>
        </div>
        
        {/* Main content area */}
        <div className="p-6 pt-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={mainSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-24" // Extra space for floating dock
            >
              {/* PROJECT DETAILS SECTION */}
              {mainSection === 'details' && (
                <>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="relative">
                    <GlowingEffect disabled={false} borderWidth={1.5} spread={40} />
                    
                    <ProjectDetailForm 
                      project={project} 
                      setProject={setProject}
                      activeSection={subSection}
                      readOnly={user.role !== 'supervisor'} 
                    />
                  </div>
                  
                  {/* Show floating dock only for details section */}
                  <FloatingDock 
                    items={dockItems}
                    desktopClassName="fixed left-1/2 bottom-8 transform -translate-x-1/2 z-50"
                  />
                </>
              )}
              
              {/* AI ASSISTANT SECTION */}
              {mainSection === 'chat' && (
  <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 relative">
    <GlowingEffect disabled={false} borderWidth={1} spread={30} />
    
    <div className="border-b border-gray-200 dark:border-gray-700 p-4 relative z-10">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
        <IconMessage className="mr-2 h-5 w-5 text-indigo-500 dark:text-indigo-400" />
        AI Assistant
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Ask questions about this project or get assistance with tasks
      </p>
    </div>
    
    <div className="relative z-10">
      <HardcodedChatbot 
        projectTitle={project.title}
      />
    </div>
  </div>
)}
              
              {/* UPDATES SECTION */}
              {mainSection === 'updates' && (
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                  <GlowingEffect disabled={false} borderWidth={1} spread={30} />
                  
                  <div className="border-b border-gray-200 dark:border-gray-700 p-4 relative z-10">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <IconBell className="mr-2 h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                      Project Updates
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Recent updates and announcements for this project
                    </p>
                  </div>
                  <div className="relative z-10">
                    {chatRoom?.id ? (
                      <ProjectUpdates 
                        chatRoomId={chatRoom.id}
                        projectTitle={project.title}
                        userRole = {user.role}
                      />
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Updates functionality is currently unavailable. Please try again later.
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Reload Page
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
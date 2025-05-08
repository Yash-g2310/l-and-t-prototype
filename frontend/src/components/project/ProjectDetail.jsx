import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';
import ProjectDetailForm from './ProjectDetailForm';
import ProjectChat from './ProjectChat';
import ProjectUpdates from './ProjectUpdates';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundGradient } from '../ui/background-gradient';
import { GlowingEffect } from '../ui/glowing-effect';
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
  IconAlertTriangle,
  IconChevronRight
} from '@tabler/icons-react';
import axios from 'axios';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../ui/resizable-navbar';

// Enhanced floating dock for sub-navigation with icons-only interface
const FloatingDock = ({ activeSection, setActiveSection, sections }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  
  return (
    <motion.div
      className="fixed left-1/2 bottom-8 transform -translate-x-1/2 z-50 bg-white/90 dark:bg-neutral-900/90 rounded-full px-3 py-2 shadow-xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <div className="flex items-center space-x-1">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            onMouseEnter={() => setHoveredIcon(section.id)}
            onMouseLeave={() => setHoveredIcon(null)}
            className={`relative p-2.5 rounded-full transition-all ${
              activeSection === section.id
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeSection === section.id && (
              <motion.div
                layoutId="floatingDockActiveIndicator"
                className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-800 rounded-full -z-10"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30
                }}
              />
            )}
            
            <span className="relative z-10">{section.icon}</span>
            
            {/* Label that appears on hover */}
            <AnimatePresence>
              {hoveredIcon === section.id && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.6 }}
                  animate={{ opacity: 1, y: -35, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.6 }}
                  className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {section.label}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

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
  const navbarRef = useRef(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        const response = await axios.get(
          `${API_URL}/api/projects/${projectId}/`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setProject(response.data);
        
        // Fetch chat room for this project
        const chatRoomsResponse = await axios.get(
          `${API_URL}/api/chat-rooms/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const projectChatRoom = chatRoomsResponse.data.find(
          room => room.project === parseInt(projectId)
        );
        
        if (projectChatRoom) {
          setChatRoom(projectChatRoom);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.response?.data?.detail || 'Failed to load project details.');
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

  // Sub-section items for the floating dock - styled like create project page
  const subSections = [
    { 
      id: 'basic', 
      label: 'Basic Info', 
      icon: <IconClipboardCheck className="h-5 w-5" /> 
    },
    { 
      id: 'timeline', 
      label: 'Timeline', 
      icon: <IconCalendarEvent className="h-5 w-5" /> 
    },
    { 
      id: 'workers', 
      label: 'Workers', 
      icon: <IconUsers className="h-5 w-5" /> 
    },
    { 
      id: 'suppliers', 
      label: 'Suppliers', 
      icon: <IconPackage className="h-5 w-5" /> 
    },
    { 
      id: 'risks', 
      label: 'Risk Analysis', 
      icon: <IconAlertTriangle className="h-5 w-5" /> 
    },
  ];

  // Handle navigation item clicks
  const handleNavItemClick = (item) => {
    const sectionId = item.id || item.link.replace('#', '');
    setMainSection(sectionId);
    
    // Reset subsection to default when switching main sections
    if (sectionId === 'details') {
      setSubSection('basic');
    }
    
    setIsMobileMenuOpen(false);
  };

  // Project logo/icon component
  const ProjectLogo = () => (
    <div className="flex items-center z-10">
      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
        <IconInfoCircle className="h-5 w-5 text-white" />
      </div>
      <span className="font-medium text-gray-900 dark:text-white text-lg">
        {project?.title || 'Project Details'}
      </span>
    </div>
  );

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
  }
  
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
      
        {/* Properly implemented Resizable Navbar with sticky behavior */}
        <div className="relative w-full">
          <Navbar className="top-0 sticky">
            {/* Desktop Navigation */}
            <NavBody ref={navbarRef}>
              <ProjectLogo />
              <NavItems 
                items={navItems} 
                onItemClick={handleNavItemClick}
                activeItemId={mainSection}
              />
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
        <div className="p-6 pt-12 max-w-7xl mx-auto mb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={mainSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
                    {/* Restore glowing effect */}
                    <GlowingEffect disabled={false} borderWidth={1.5} spread={40} />
                    
                    <ProjectDetailForm 
                      project={project} 
                      setProject={setProject}
                      activeSection={subSection}
                      readOnly={user.role !== 'supervisor'} 
                    />
                  </div>
                  
                  {/* Floating dock with icons-only design */}
                  <FloatingDock 
                    activeSection={subSection} 
                    setActiveSection={setSubSection} 
                    sections={subSections} 
                  />
                </>
              )}
              
              {mainSection === 'chat' && chatRoom && (
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                  {/* Add glowing effect to chat section too */}
                  <GlowingEffect disabled={false} borderWidth={1.5} spread={40} />
                  
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
                    <ProjectChat 
                      chatRoomId={chatRoom.id} 
                      projectId={project.id}
                      projectTitle={project.title}
                      userRole={user.role} 
                    />
                  </div>
                </div>
              )}
              
              {mainSection === 'updates' && chatRoom && (
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                  {/* Add glowing effect to updates section too */}
                  <GlowingEffect disabled={false} borderWidth={1.5} spread={40} />
                  
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
                    <ProjectUpdates 
                      chatRoomId={chatRoom.id}
                      projectTitle={project.title}
                    />
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
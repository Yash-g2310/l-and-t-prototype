import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sidebar, 
  SidebarBody, 
  SidebarLink,
  SidebarHeader,
  SidebarFooter 
} from './ui/sidebar';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { GlowingEffect } from './ui/glowing-effect';
import { 
  IconHome, 
  IconUser, 
  IconSettings,
  IconBriefcase,
  IconCalendar,
  IconUsers,
  IconLogout,
  IconChartPie,
  IconMail,
  IconPhone
} from '@tabler/icons-react';

export default function Profile() {
  const { user, logout } = useAuth();
  
  // Define sidebar navigation links
  const navLinks = [
    { label: 'Dashboard', href: '/', icon: <IconHome className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Projects', href: '/projects', icon: <IconBriefcase className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Schedule', href: '#', icon: <IconCalendar className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Team', href: '#', icon: <IconUsers className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Analytics', href: '#', icon: <IconChartPie className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Profile', href: '/profile', icon: <IconUser className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Settings', href: '#', icon: <IconSettings className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-zinc-900">
      {/* Sidebar */}
      <Sidebar>
        <SidebarBody>
          {/* Logo or Brand - Only visible when expanded */}
          <SidebarHeader>
            <div className="flex items-center">
              <span className="text-xl font-bold dark:text-white">Construction AI</span>
            </div>
          </SidebarHeader>
          
          {/* Navigation Links - Icons always visible, text only when expanded */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <SidebarLink key={link.href} link={link} />
            ))}
          </div>
          
          {/* User Info and Logout at Bottom - Only visible when expanded */}
          <SidebarFooter>
            <div className="flex items-center mb-4">
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
          </SidebarFooter>
        </SidebarBody>
      </Sidebar>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 pt-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold dark:text-white">Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your personal information</p>
          </div>
          
          {/* Profile Card */}
          <CardContainer containerClassName="py-0">
            <CardBody className="relative w-full bg-white dark:bg-zinc-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Profile Image */}
                <CardItem translateZ={20} className="w-full md:w-1/3 flex justify-center">
                  <div className="relative">
                    {user?.profile_picture ? (
                      <img 
                        src={user.profile_picture} 
                        alt="Profile" 
                        className="w-48 h-48 rounded-full object-cover border-4 border-white dark:border-zinc-700 shadow-lg"
                      />
                    ) : (
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-5xl font-bold border-4 border-white dark:border-zinc-700 shadow-lg">
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </CardItem>
                
                {/* Profile Info */}
                <CardItem translateZ={30} className="w-full md:w-2/3 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user?.first_name} {user?.last_name}
                    </h2>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium capitalize mt-1">
                      {user?.role}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <IconMail className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                      <span>{user?.email}</span>
                    </div>
                    
                    {user?.phone && (
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <IconPhone className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Edit Profile
                  </button>
                </CardItem>
              </div>
              
              <GlowingEffect disabled={false} borderWidth={1.5} />
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </div>
  );
}
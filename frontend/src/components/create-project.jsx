import React, { useState } from 'react';
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
  IconArrowLeft,
  IconCheck
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateProject() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    status: 'planning'
  });
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/projects/`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        navigate('/projects');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.response?.data?.detail || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          {/* Back button */}
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <IconArrowLeft className="mr-1 h-4 w-4" />
            Back to Projects
          </button>
          
          {/* Form Card */}
          <CardContainer containerClassName="py-0">
            <CardBody className="relative w-full bg-white dark:bg-zinc-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-8">
              <CardItem translateZ={20}>
                <h1 className="text-2xl font-bold dark:text-white">Create New Project</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Fill in the details to create a new construction project</p>
              </CardItem>
              
              {error && (
                <CardItem translateZ={30} className="mt-4">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                </CardItem>
              )}
              
              <CardItem translateZ={40} className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Project Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                    >
                      <option value="planning">Planning</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>Creating Project...</>
                      ) : (
                        <>
                          <IconCheck className="mr-2 h-4 w-4" />
                          Create Project
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </CardItem>
              
              <GlowingEffect disabled={false} borderWidth={1.5} />
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </div>
  );
}
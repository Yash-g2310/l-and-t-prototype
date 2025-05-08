import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './layout/DashboardLayout';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { GlowingEffect } from './ui/glowing-effect';
import { Card } from './ui/focus-cards';
import {
    IconPlus,
    IconMapPin,
    IconCalendarTime,
    IconBuilding
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Projects() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');

            if (token) {
                const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/projects/`;
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.detail || 'Failed to fetch projects');
                setProjects(data);
            }
        } catch (error) {
            setError(error.message || 'Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = () => navigate('/create-project');

    const handleProjectClick = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    const statusColors = {
        planning: 'from-blue-600/80 to-blue-800/90 dark:from-blue-800/90 dark:to-blue-900 border-blue-500 dark:border-blue-700',
        in_progress: 'from-amber-600/80 to-amber-800/90 dark:from-amber-800/90 dark:to-amber-900 border-amber-500 dark:border-amber-700',
        completed: 'from-green-600/80 to-green-800/90 dark:from-green-800/90 dark:to-green-900 border-green-500 dark:border-green-700',
        on_hold: 'from-red-600/80 to-red-800/90 dark:from-red-800/90 dark:to-red-900 border-red-500 dark:border-red-700'
    };

    const statusBadgeColors = {
        planning: 'bg-blue-200 text-blue-900 dark:bg-blue-300 dark:text-blue-900',
        in_progress: 'bg-amber-200 text-amber-900 dark:bg-amber-300 dark:text-amber-900',
        completed: 'bg-green-200 text-green-900 dark:bg-green-300 dark:text-green-900',
        on_hold: 'bg-red-200 text-red-900 dark:bg-red-300 dark:text-red-900'
    };

    const statusIcons = {
        planning: <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <IconBuilding className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        </div>,
        in_progress: <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <IconBuilding className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        </div>,
        completed: <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <IconBuilding className="h-4 w-4 text-green-500 dark:text-green-400" />
        </div>,
        on_hold: <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <IconBuilding className="h-4 w-4 text-red-500 dark:text-red-400" />
        </div>
    };

    return (
        <DashboardLayout>
            <div className="p-8 pt-6">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold dark:text-white">Projects</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor your construction projects</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {error && (
                            <div className="col-span-full">
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                                    <p className="font-medium">Error loading projects: {error}</p>
                                    <button
                                        onClick={fetchProjects}
                                        className="mt-2 text-sm bg-red-100 dark:bg-red-800/30 px-3 py-1 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        )}

                        {user?.role === 'supervisor' && (
                            <div className="h-full" onClick={handleCreateProject}>
                                <CardContainer containerClassName="py-0 h-full">
                                    <CardBody className="relative h-full w-full bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 p-6 cursor-pointer">
                                        <CardItem translateZ={20} className="flex flex-col items-center justify-center text-center h-full">
                                            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4">
                                                <IconPlus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Create New Project</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Add a new construction project to your portfolio</p>
                                        </CardItem>
                                        <GlowingEffect disabled={false} borderWidth={1.5} spread={30} />
                                    </CardBody>
                                </CardContainer>
                            </div>
                        )}

                        {loading ? (
                            Array(6).fill().map((_, index) => (
                                <div key={index} className="h-64 rounded-xl bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
                            ))
                        ) : projects.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No projects found. {user?.role === 'supervisor' ? 'Create your first project!' : 'You have not been assigned to any projects yet.'}
                                </p>
                            </div>
                        ) : (
                            projects.map((project, index) => (
                                <motion.div 
                                    key={project.id}
                                    onClick={() => handleProjectClick(project.id)}
                                    onMouseEnter={() => setHoveredCard(project.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className={`cursor-pointer rounded-xl overflow-hidden bg-gradient-to-br ${statusColors[project.status]} border shadow-lg transition-all duration-300 h-full text-white`}
                                    animate={{
                                        scale: hoveredCard === project.id ? 1.05 : 1,
                                        boxShadow: hoveredCard === project.id ? 
                                            "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.2)" : 
                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                                    }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 300, 
                                        damping: 20,
                                        bounce: 0.2
                                    }}
                                >
                                    <div className="p-6 h-full flex flex-col relative z-10">
                                        {/* Glowing overlay effect on hover */}
                                        {hoveredCard === project.id && (
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent z-0" />
                                        )}
                                        
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            {statusIcons[project.status]}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadgeColors[project.status]}`}>
                                                {project.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-lg font-medium text-white mb-2 line-clamp-1 relative z-10">
                                            {project.title}
                                        </h3>
                                        
                                        <div className="flex items-center text-sm text-white/80 mb-3 relative z-10">
                                            <IconMapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                            <span className="truncate">{project.location}</span>
                                        </div>
                                        
                                        <p className="text-sm text-white/90 line-clamp-2 mb-4 relative z-10">
                                            {project.description}
                                        </p>
                                        
                                        <div className="mt-auto flex items-center justify-between relative z-10">
                                            <div className="flex items-center">
                                                <IconCalendarTime className="h-4 w-4 mr-1 text-white/70" />
                                                <span className="text-xs text-white/70">
                                                    {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
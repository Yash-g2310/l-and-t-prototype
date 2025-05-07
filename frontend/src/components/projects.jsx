import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './layout/DashboardLayout';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { GlowingEffect } from './ui/glowing-effect';
import {
    IconHome,
    IconUser,
    IconSettings,
    IconBriefcase,
    IconCalendar,
    IconUsers,
    IconChartPie,
    IconPlus,
    IconCalendarTime,
    IconMapPin
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
    const handleProjectClick = (projectId) => navigate(`/projects/${projectId}`);

    const statusColors = {
        planning: 'bg-blue-500',
        in_progress: 'bg-amber-500',
        completed: 'bg-green-500',
        on_hold: 'bg-red-500'
    };

    return (
        <DashboardLayout>
            <div className="p-8 pt-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold dark:text-white">Projects</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor your construction projects</p>
                    </div>

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
                            <CardContainer containerClassName="py-0 h-full">
                                <CardBody
                                    className="relative h-full w-full bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 p-6 cursor-pointer"
                                    onClick={handleCreateProject}
                                >
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
                            projects.map((project) => (
                                <CardContainer key={project.id} containerClassName="py-0 h-full">
                                    <CardBody
                                        className="relative h-full w-full bg-white dark:bg-zinc-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-6 cursor-pointer"
                                        onClick={() => handleProjectClick(project.id)}
                                    >
                                        <div className={`absolute top-0 right-0 w-2 h-14 ${statusColors[project.status]} rounded-tr-xl`}></div>

                                        <CardItem translateZ={20}>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate pr-4">{project.title}</h3>
                                            <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <IconMapPin className="h-4 w-4 mr-1" />
                                                <span className="truncate">{project.location}</span>
                                            </div>
                                        </CardItem>

                                        <CardItem translateZ={30} className="mt-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
                                        </CardItem>

                                        <CardItem translateZ={40} className="mt-6">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <IconCalendarTime className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <span className={`px-2.5 py-1 text-xs rounded-full capitalize 
                                                    ${statusColors[project.status]}`}>
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </CardItem>

                                        <GlowingEffect disabled={false} borderWidth={1.5} />
                                    </CardBody>
                                </CardContainer>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

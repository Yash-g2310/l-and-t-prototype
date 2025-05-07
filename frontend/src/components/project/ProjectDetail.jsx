import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';
import TabNavigation from '../ui/TabNavigation';
import ProjectDetailForm from './ProjectDetailForm';
import ProjectChat from './ProjectChat';
import ProjectUpdates from './ProjectUpdates';
import { 
  IconInfoCircle,
  IconMessage,
  IconBell,
  IconArrowLeft,
  IconLoader2
} from '@tabler/icons-react';
import axios from 'axios';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [chatRoom, setChatRoom] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProject(response.data);
        
        // Fetch chat room for this project
        const chatRoomsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/chat-rooms/`,
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

  // Define available tabs based on user role
  const getTabs = () => {
    const tabs = [];
    
    // All users can see details, but only supervisors can edit
    tabs.push({ 
      id: 'details', 
      label: 'Project Details', 
      icon: <IconInfoCircle className="h-5 w-5" /> 
    });
    
    // All users can chat
    tabs.push({ 
      id: 'chat', 
      label: 'AI Assistant', 
      icon: <IconMessage className="h-5 w-5" /> 
    });
    
    // All users can see updates
    tabs.push({ 
      id: 'updates', 
      label: 'Updates', 
      icon: <IconBell className="h-5 w-5" /> 
    });
    
    return tabs;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full p-8">
          <IconLoader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading project...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8 h-full">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 mb-4">
            {error}
          </div>
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

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8 h-full">
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
  if (user.role === 'worker' && activeTab === 'details') {
    setActiveTab('chat');
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto p-8 pt-6">
        {/* Back button and project title */}
        <div className="max-w-7xl mx-auto mb-6">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <IconArrowLeft className="mr-1 h-4 w-4" />
            Back to Projects
          </button>
          
          <h1 className="text-2xl font-bold dark:text-white">{project.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 capitalize">
            Status: <span className={`font-medium ${
              project.status === 'planning' ? 'text-blue-600 dark:text-blue-400' :
              project.status === 'in_progress' ? 'text-amber-600 dark:text-amber-400' :
              project.status === 'completed' ? 'text-green-600 dark:text-green-400' :
              'text-red-600 dark:text-red-400'
            }`}>{project.status.replace('_', ' ')}</span>
          </p>
        </div>
        
        {/* Tabs */}
        <div className="max-w-7xl mx-auto">
          <TabNavigation 
            tabs={getTabs()} 
            activeTab={activeTab} 
            onChange={setActiveTab} 
          />
          
          {/* Tab content */}
          <div>
            {activeTab === 'details' && (
              <ProjectDetailForm 
                project={project} 
                setProject={setProject}
                readOnly={user.role !== 'supervisor'} 
              />
            )}
            
            {activeTab === 'chat' && chatRoom && (
              <ProjectChat 
                chatRoomId={chatRoom.id} 
                projectId={project.id}
                projectTitle={project.title}
                userRole={user.role} 
              />
            )}
            
            {activeTab === 'updates' && chatRoom && (
              <ProjectUpdates 
                chatRoomId={chatRoom.id}
                projectTitle={project.title}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
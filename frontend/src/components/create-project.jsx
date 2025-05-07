import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './layout/DashboardLayout';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { GlowingEffect } from './ui/glowing-effect';
import { 
  IconArrowLeft,
  IconCheck,
  IconExclamationCircle
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MapSelector from './project/MapSelector';

export default function CreateProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_description: '',
    location: '',
    latitude: null,
    longitude: null,
    start_date: '',
    end_date: '',
    status: 'planning',
    estimated_workers: 0,
    budget: 0,
    risk_assessment: '',
    mitigation_strategies: '',
    supply_chain_requirements: '',
    resource_allocation: '',
    equipment_requirements: ''
  });
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleLocationSelect = (location, lat, lng) => {
    setFormData(prev => ({
      ...prev,
      location,
      latitude: lat,
      longitude: lng
    }));
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

  // Redirect if user is not a supervisor
  if (user?.role !== 'supervisor') {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8 h-full">
          <IconExclamationCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Only supervisors can create projects.
          </p>
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

  return (
    <DashboardLayout>
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
                  {/* Basic Info Section */}
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg mb-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h2>
                    
                    <div className="space-y-4">
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
                          Short Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows={2}
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="detailed_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Detailed Description
                        </label>
                        <textarea
                          id="detailed_description"
                          name="detailed_description"
                          value={formData.detailed_description}
                          onChange={handleChange}
                          rows={4}
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                          placeholder="Provide technical details about the project..."
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Location Section */}
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg mb-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Location</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Location Name
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
                      
                      <div className="h-64 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-700">
                        <MapSelector onLocationSelect={handleLocationSelect} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Latitude
                          </label>
                          <input
                            type="text"
                            value={formData.latitude || ''}
                            readOnly
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Longitude
                          </label>
                          <input
                            type="text"
                            value={formData.longitude || ''}
                            readOnly
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline Section */}
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg mb-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Timeline & Status</h2>
                    
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
                    
                    <div className="mt-4">
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
                  </div>
                  
                  {/* Resources Section */}
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg mb-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resources & Budget</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="estimated_workers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Estimated Workers
                        </label>
                        <input
                          type="number"
                          id="estimated_workers"
                          name="estimated_workers"
                          value={formData.estimated_workers}
                          onChange={handleChange}
                          min="0"
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Budget (₹)
                        </label>
                        <input
                          type="number"
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          min="0"
                          step="1000"
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="resource_allocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Resource Allocation Plan
                      </label>
                      <textarea
                        id="resource_allocation"
                        name="resource_allocation"
                        value={formData.resource_allocation}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                        placeholder="Describe how resources will be allocated and distributed..."
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="equipment_requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Equipment Requirements
                      </label>
                      <textarea
                        id="equipment_requirements"
                        name="equipment_requirements"
                        value={formData.equipment_requirements}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                        placeholder="List any special equipment or machinery needed..."
                      />
                    </div>
                  </div>
                  
                  {/* Risk & Supply Chain Section */}
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg mb-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Risk & Supply Chain</h2>
                    
                    <div>
                      <label htmlFor="risk_assessment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Risk Assessment
                      </label>
                      <textarea
                        id="risk_assessment"
                        name="risk_assessment"
                        value={formData.risk_assessment}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                        placeholder="Identify potential risks and their likelihood..."
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="mitigation_strategies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mitigation Strategies
                      </label>
                      <textarea
                        id="mitigation_strategies"
                        name="mitigation_strategies"
                        value={formData.mitigation_strategies}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                        placeholder="Describe strategies to mitigate identified risks..."
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="supply_chain_requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Supply Chain Requirements
                      </label>
                      <textarea
                        id="supply_chain_requirements"
                        name="supply_chain_requirements"
                        value={formData.supply_chain_requirements}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-zinc-700 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-500"
                        placeholder="Outline supply chain requirements and potential suppliers..."
                      />
                    </div>
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
    </DashboardLayout>
  );
}
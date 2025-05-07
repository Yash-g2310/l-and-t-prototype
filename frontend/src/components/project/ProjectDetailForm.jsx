import React, { useState, useEffect } from 'react';
import { updateProject } from '../../services/projectService';
// import { IconSave, IconEdit, IconX } from '@tabler/icons-react';
import MapSelector from './MapSelector';
import ProjectTimeline from './ProjectTimeline';
import ProjectWorkers from './ProjectWorkers';
import ProjectSuppliers from './ProjectSuppliers';
import ProjectRisks from './ProjectRisks';

export default function ProjectDetailForm({ project, setProject, readOnly }) {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        detailed_description: project.detailed_description || '',
        location: project.location || '',
        latitude: project.latitude,
        longitude: project.longitude,
        start_date: project.start_date ? project.start_date.split('T')[0] : '',
        end_date: project.end_date ? project.end_date.split('T')[0] : '',
        status: project.status || 'planning',
        estimated_workers: project.estimated_workers || 0,
        budget: project.budget || 0,
        current_spending: project.current_spending || 0,
        risk_assessment: project.risk_assessment || '',
        mitigation_strategies: project.mitigation_strategies || '',
        supply_chain_requirements: project.supply_chain_requirements || '',
        resource_allocation: project.resource_allocation || '',
        equipment_requirements: project.equipment_requirements || ''
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
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
    if (readOnly) return;

    try {
      setIsSaving(true);
      setError(null);
      const updatedProject = await updateProject(project.id, formData);
      setProject(updatedProject);
      setIsEditing(false);
    } catch (err) {
      setError(err.detail || 'Failed to update project');
    } finally {
      setIsSaving(false);
    }
  };

  // Tabs for the different sections of project details
  const detailTabs = [
    { id: 'details', label: 'Basic Info' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'workers', label: 'Workers' },
    { id: 'suppliers', label: 'Suppliers' },
    { id: 'risks', label: 'Risk Analysis' }
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
      {/* Detail Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4 px-6 py-3" aria-label="Tabs">
          {detailTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 py-2 text-sm font-medium rounded-md
                ${activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'details' && (
        <form onSubmit={handleSubmit} className="p-6">
          {/* Form header with edit/save buttons */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Project Details
            </h3>
            
            {!readOnly && (
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-600"
                    >
                      <IconX className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <IconSave className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit Project
                  </button>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Status and Dates */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Budget (₹)
              </label>
              <input
                type="number"
                name="budget"
                id="budget"
                value={formData.budget}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                id="start_date"
                value={formData.start_date}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                id="end_date"
                value={formData.end_date}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Workers */}
            <div>
              <label htmlFor="estimated_workers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Estimated Workers
              </label>
              <input
                type="number"
                name="estimated_workers"
                id="estimated_workers"
                value={formData.estimated_workers}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="current_spending" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Spending (₹)
              </label>
              <input
                type="number"
                name="current_spending"
                id="current_spending"
                value={formData.current_spending}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Location with Map */}
            <div className="col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mb-2 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              
              {/* Map selector (only visible when editing) */}
              {isEditing && !readOnly && (
                <div className="h-64 bg-gray-100 dark:bg-neutral-900 rounded-md overflow-hidden">
                  <MapSelector
                    initialLocation={{
                      lat: formData.latitude,
                      lng: formData.longitude
                    }}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
              )}
              
              {/* Show static map when not editing */}
              {(!isEditing || readOnly) && formData.latitude && formData.longitude && (
                <div className="h-64 bg-gray-100 dark:bg-neutral-900 rounded-md overflow-hidden">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${formData.latitude},${formData.longitude}&zoom=13&size=600x400&markers=color:red%7C${formData.latitude},${formData.longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                    alt="Project location"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Detailed Description */}
            <div className="col-span-2">
              <label htmlFor="detailed_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Detailed Technical Description
              </label>
              <textarea
                name="detailed_description"
                id="detailed_description"
                rows={5}
                value={formData.detailed_description}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Risk Assessment */}
            <div className="col-span-2">
              <label htmlFor="risk_assessment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Risk Assessment
              </label>
              <textarea
                name="risk_assessment"
                id="risk_assessment"
                rows={3}
                value={formData.risk_assessment}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Mitigation Strategies */}
            <div className="col-span-2">
              <label htmlFor="mitigation_strategies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mitigation Strategies
              </label>
              <textarea
                name="mitigation_strategies"
                id="mitigation_strategies"
                rows={3}
                value={formData.mitigation_strategies}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Supply Chain Requirements */}
            <div className="col-span-2">
              <label htmlFor="supply_chain_requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Supply Chain Requirements
              </label>
              <textarea
                name="supply_chain_requirements"
                id="supply_chain_requirements"
                rows={3}
                value={formData.supply_chain_requirements}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Resource Allocation */}
            <div className="col-span-2">
              <label htmlFor="resource_allocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Resource Allocation
              </label>
              <textarea
                name="resource_allocation"
                id="resource_allocation"
                rows={3}
                value={formData.resource_allocation}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Equipment Requirements */}
            <div className="col-span-2">
              <label htmlFor="equipment_requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Equipment Requirements
              </label>
              <textarea
                name="equipment_requirements"
                id="equipment_requirements"
                rows={3}
                value={formData.equipment_requirements}
                onChange={handleChange}
                disabled={!isEditing || readOnly}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </form>
      )}

      {activeTab === 'timeline' && project && (
        <ProjectTimeline 
          projectId={project.id} 
          readOnly={readOnly} 
        />
      )}

      {activeTab === 'workers' && project && (
        <ProjectWorkers 
          projectId={project.id} 
          supervisor={project.supervisor}
          readOnly={readOnly} 
        />
      )}

      {activeTab === 'suppliers' && project && (
        <ProjectSuppliers 
          projectId={project.id} 
          readOnly={readOnly} 
        />
      )}

      {activeTab === 'risks' && project && (
        <ProjectRisks 
          projectId={project.id} 
          readOnly={readOnly} 
        />
      )}
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { updateProject } from '../../services/projectService';
import MapSelector from './MapSelector';
import ProjectTimeline from './ProjectTimeline';
import ProjectWorkers from './ProjectWorkers';
import ProjectSuppliers from './ProjectSuppliers';
import ProjectRisks from './ProjectRisks';
import { motion } from 'framer-motion';
import { GlowingEffect } from '../ui/glowing-effect';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

// Custom icon components to avoid circular dependency
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
    <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M14 4l0 4l-6 0l0 -4" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
    <path d="M16 5l3 3" />
  </svg>
);

const CancelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
);

// Section wrapper with animations
const SectionWrapper = ({ id, children, isVisible }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (isVisible && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [isVisible]);
  
  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.5,
        y: isVisible ? 0 : 10,
        scale: isVisible ? 1 : 0.98
      }}
      transition={{ duration: 0.3 }}
      className={`mb-12 scroll-mt-24 transition-all ${!isVisible && 'pointer-events-none'}`}
    >
      {children}
    </motion.div>
  );
};

export default function ProjectDetailForm({ project, setProject, activeSection, readOnly }) {
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
    current_spending: 0,
    risk_assessment: '',
    mitigation_strategies: '',
    supply_chain_requirements: '',
    resource_allocation: '',
    equipment_requirements: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (project) {
      // Initialize form data from project
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

  return (
    <>
      {/* Basic Info Section */}
      <SectionWrapper id="basic" isVisible={activeSection === 'basic'}>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            {/* Form header with edit/save buttons */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Basic Information
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
                        <CancelIcon />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <SaveIcon />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <EditIcon />
                      Edit Project
                    </button>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="col-span-2">
                  <Label htmlFor="title" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">
                    Project Title
                  </Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={!isEditing || readOnly}
                    className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Status and Dates */}
                <div>
                  <Label htmlFor="status" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">
                    Status
                  </Label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={!isEditing || readOnly}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="budget" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">
                    Budget (₹)
                  </Label>
                  <Input
                    type="number"
                    name="budget"
                    id="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    disabled={!isEditing || readOnly}
                    className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <Label htmlFor="start_date" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    name="start_date"
                    id="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    disabled={!isEditing || readOnly}
                    className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <Label htmlFor="end_date" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">
                    End Date
                  </Label>
                  <Input
                    type="date"
                    name="end_date"
                    id="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    disabled={!isEditing || readOnly}
                    className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Workers */}
                <div>
                  <Label htmlFor="estimated_workers" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">
                    Estimated Workers
                  </Label>
                  <Input
                    type="number"
                    name="estimated_workers"
                    id="estimated_workers"
                    value={formData.estimated_workers}
                    onChange={handleChange}
                    disabled={!isEditing || readOnly}
                    className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <Label htmlFor="current_spending" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">
                    Current Spending (₹)
                  </Label>
                  <Input
                    type="number"
                    name="current_spending"
                    id="current_spending"
                    value={formData.current_spending}
                    onChange={handleChange}
                    disabled={!isEditing || readOnly}
                    className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Location with Map */}
                <div className="col-span-2">
                  <Label htmlFor="location" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">
                    Location
                  </Label>
                  <Input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing || readOnly}
                    className="mb-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  
                  {/* Map selector (only visible when editing) */}
                  {isEditing && !readOnly ? (
                    <div className="h-64 bg-gray-100 dark:bg-neutral-900 rounded-md overflow-hidden">
                      <MapSelector
                        initialLocation={{
                          lat: formData.latitude,
                          lng: formData.longitude
                        }}
                        onLocationSelect={handleLocationSelect}
                      />
                    </div>
                  ) : (
                    formData.latitude && formData.longitude && (
                      <div className="h-64 bg-gray-100 dark:bg-neutral-900 rounded-md overflow-hidden">
                        {/* Fallback display if API key not available */}
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                          <div className="text-center text-gray-600 dark:text-gray-400">
                            <p className="mb-2">Location: {formData.location}</p>
                            <p>Coordinates: {formData.latitude}, {formData.longitude}</p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <Label htmlFor="description" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">
                    Description
                  </Label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!isEditing || readOnly}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Detailed Description */}
                <div className="col-span-2 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800/40">
                  <Label htmlFor="detailed_description" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">
                    Detailed Technical Description
                  </Label>
                  <textarea
                    name="detailed_description"
                    id="detailed_description"
                    rows={5}
                    value={formData.detailed_description}
                    onChange={handleChange}
                    disabled={!isEditing || readOnly}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-2 text-xs text-indigo-700 dark:text-indigo-300">
                    Include detailed technical specifications, architectural considerations, and engineering requirements.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </SectionWrapper>

      {/* Timeline Section */}
      <SectionWrapper id="timeline" isVisible={activeSection === 'timeline'}>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          {project && (
            <ProjectTimeline 
              projectId={project.id} 
              readOnly={readOnly} 
            />
          )}
        </div>
      </SectionWrapper>

      {/* Workers Section */}
      <SectionWrapper id="workers" isVisible={activeSection === 'workers'}>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          {project && (
            <ProjectWorkers 
              projectId={project.id} 
              supervisor={project.supervisor}
              readOnly={readOnly} 
            />
          )}
        </div>
      </SectionWrapper>

      {/* Suppliers Section */}
      <SectionWrapper id="suppliers" isVisible={activeSection === 'suppliers'}>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          {project && (
            <ProjectSuppliers 
              projectId={project.id} 
              readOnly={readOnly} 
            />
          )}
        </div>
      </SectionWrapper>

      {/* Risks Section */}
      <SectionWrapper id="risks" isVisible={activeSection === 'risks'}>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          {project && (
            <ProjectRisks 
              projectId={project.id} 
              readOnly={readOnly} 
            />
          )}
        </div>
      </SectionWrapper>
    </>
  );
}
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { updateProject } from '../../services/projectService';
import MapSelector from './MapSelector';
import ProjectTimeline from './ProjectTimeline';
import ProjectWorkers from './ProjectWorkers';
import ProjectSuppliers from './ProjectSuppliers';
import ProjectRisks from './ProjectRisks';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowingEffect } from '../ui/glowing-effect';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { BackgroundGradient } from '../ui/background-gradient';
import TabNavigation from '../ui/TabNavigation';
import ColourfulText from '../ui/colourful-text';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { 
  IconBuildingSkyscraper, 
  IconMapPin, 
  IconCalendar, 
  IconUsers, 
  IconCash, 
  IconFileDescription,
  IconAlertTriangle, 
  IconTruckDelivery, 
  IconShield,
  IconClipboardCheck,
  IconEdit,
  IconX,
  IconDeviceFloppy
} from '@tabler/icons-react';

// Section wrapper with animations - memoized to prevent re-renders
const SectionWrapper = React.memo(({ id, title, icon, color = "indigo", children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      id={id}
      className="mb-10 scroll-mt-20"
    >
      <div className={`bg-gradient-to-br from-${color}-50/70 to-${color}-50/30 dark:from-${color}-950/20 dark:to-${color}-950/10 rounded-xl p-6 border border-${color}-100/50 dark:border-${color}-900/30 shadow-sm relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/80 dark:bg-black/10 backdrop-blur-[1px] z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className={`w-12 h-12 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mr-4 shadow-sm`}>
              <div className={`text-${color}-600 dark:text-${color}-400`}>{icon}</div>
            </div>
            <h2 className={`text-2xl font-bold text-${color}-700 dark:text-${color}-300`}>{title}</h2>
          </div>
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

SectionWrapper.displayName = 'SectionWrapper';

// Summary card showing project key metrics - simplified design
const ProjectSummaryCard = React.memo(({ formData }) => {
  // Calculate project metrics
  const totalDays = Math.ceil((new Date(formData.end_date) - new Date(formData.start_date)) / (1000 * 60 * 60 * 24)) || 0;
  const daysElapsed = Math.ceil((new Date() - new Date(formData.start_date)) / (1000 * 60 * 60 * 24)) || 0;
  const percentComplete = Math.min(100, Math.round((daysElapsed / totalDays) * 100)) || 0;
  const budgetSpent = formData.current_spending > 0 ? Math.round((formData.current_spending / formData.budget) * 100) : 0;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 p-1 mb-8 bg-white dark:bg-neutral-900 shadow-sm">
      <div className="p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <IconClipboardCheck className="mr-2 h-5 w-5 text-indigo-500" />
          Project Overview
        </h3>
        
        <BentoGrid className="grid-cols-2 md:grid-cols-4 auto-rows-[6rem] gap-3">
          <BentoGridItem
            title="Timeline"
            description={`${daysElapsed} of ${totalDays} days (${percentComplete}%)`}
            icon={<IconCalendar className="h-5 w-5 text-blue-500" />}
            className="col-span-1"
          />
          
          <BentoGridItem
            title="Budget Spent"
            description={`₹${formData.current_spending} of ₹${formData.budget} (${budgetSpent}%)`}
            icon={<IconCash className="h-5 w-5 text-emerald-500" />}
            className="col-span-1"
          />
          
          <BentoGridItem
            title="Workers"
            description={`${formData.current_worker_count || 0} of ${formData.estimated_workers} assigned`}
            icon={<IconUsers className="h-5 w-5 text-amber-500" />}
            className="col-span-1"
          />
          
          <BentoGridItem
            title="Status"
            description={formData.status.replace('_', ' ')}
            icon={<IconShield className="h-5 w-5 text-purple-500" />}
            className="col-span-1"
          />
        </BentoGrid>
      </div>
    </div>
  );
});

ProjectSummaryCard.displayName = 'ProjectSummaryCard';

// Basic info section component
const BasicInfoSection = React.memo(function BasicInfoSection({ formData, handleChange, handleLocationSelect, isEditing, readOnly }) {
  return (
    <SectionWrapper 
      id="basic-info" 
      title="Project Basics" 
      icon={<IconBuildingSkyscraper className="h-6 w-6" />} 
      color="blue"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <Label htmlFor="title" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Project Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            disabled={!isEditing || readOnly}
            className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <Label htmlFor="status" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Status</Label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            disabled={!isEditing || readOnly}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 pl-3 pr-10"
          >
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        <div>
          <Label htmlFor="budget" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Budget (₹)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IconCash className="h-5 w-5" />
            </span>
            <Input
              type="number"
              name="budget"
              id="budget"
              value={formData.budget}
              onChange={handleChange}
              disabled={!isEditing || readOnly}
              className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="start_date" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Start Date</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IconCalendar className="h-5 w-5" />
            </span>
            <Input
              type="date"
              name="start_date"
              id="start_date"
              value={formData.start_date}
              onChange={handleChange}
              disabled={!isEditing || readOnly}
              className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="end_date" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">End Date</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IconCalendar className="h-5 w-5" />
            </span>
            <Input
              type="date"
              name="end_date"
              id="end_date"
              value={formData.end_date}
              onChange={handleChange}
              disabled={!isEditing || readOnly}
              className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="estimated_workers" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Estimated Workers</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IconUsers className="h-5 w-5" />
            </span>
            <Input
              type="number"
              name="estimated_workers"
              id="estimated_workers"
              value={formData.estimated_workers}
              onChange={handleChange}
              disabled={!isEditing || readOnly}
              className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="current_spending" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Current Spending (₹)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IconCash className="h-5 w-5" />
            </span>
            <Input
              type="number"
              name="current_spending"
              id="current_spending"
              value={formData.current_spending}
              onChange={handleChange}
              disabled={!isEditing || readOnly}
              className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="col-span-2">
          <Label htmlFor="location" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Location</Label>
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <IconMapPin className="h-5 w-5" />
            </span>
            <Input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!isEditing || readOnly}
              className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="h-72 bg-gray-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
            {isEditing && !readOnly ? (
              <MapSelector
                initialLocation={{
                  lat: formData.latitude || 28.6139,
                  lng: formData.longitude || 77.2090
                }}
                onLocationSelect={handleLocationSelect}
              />
            ) : (
              formData.latitude && formData.longitude && (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    <p className="mb-2">Location: {formData.location}</p>
                    <p>Coordinates: {formData.latitude}, {formData.longitude}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
});

// Description section component
const DescriptionSection = React.memo(function DescriptionSection({ formData, handleChange, isEditing, readOnly }) {
  return (
    <SectionWrapper 
      id="description" 
      title="Project Details" 
      icon={<IconFileDescription className="h-6 w-6" />} 
      color="purple"
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="description" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Description</Label>
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
        
        <div>
          <Label htmlFor="detailed_description" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Detailed Technical Description</Label>
          <textarea
            name="detailed_description"
            id="detailed_description"
            rows={6}
            value={formData.detailed_description}
            onChange={handleChange}
            disabled={!isEditing || readOnly}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Include detailed technical specifications, architectural considerations, and engineering requirements.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
});

// Risk Assessment section component
const RiskAssessmentSection = React.memo(function RiskAssessmentSection({ formData, handleChange, isEditing, readOnly }) {
  return (
    <SectionWrapper 
      id="risk" 
      title="Risk Management" 
      icon={<IconAlertTriangle className="h-6 w-6" />} 
      color="amber"
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="risk_assessment" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Risk Assessment</Label>
          <textarea
            name="risk_assessment"
            id="risk_assessment"
            rows={4}
            value={formData.risk_assessment}
            onChange={handleChange}
            disabled={!isEditing || readOnly}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Identify potential risks that could affect project timeline, budget, or quality.
          </p>
        </div>
        
        <div>
          <Label htmlFor="mitigation_strategies" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Mitigation Strategies</Label>
          <textarea
            name="mitigation_strategies"
            id="mitigation_strategies"
            rows={4}
            value={formData.mitigation_strategies}
            onChange={handleChange}
            disabled={!isEditing || readOnly}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Outline approaches to prevent or minimize the impact of potential risks.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
});

// Resources section component
const ResourcesSection = React.memo(function ResourcesSection({ formData, handleChange, isEditing, readOnly }) {
  return (
    <SectionWrapper 
      id="resources" 
      title="Resources & Requirements" 
      icon={<IconTruckDelivery className="h-6 w-6" />} 
      color="emerald"
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="supply_chain_requirements" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Supply Chain Requirements</Label>
          <textarea
            name="supply_chain_requirements"
            id="supply_chain_requirements"
            rows={3}
            value={formData.supply_chain_requirements}
            onChange={handleChange}
            disabled={!isEditing || readOnly}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Detail materials, equipment, and suppliers needed for this project.
          </p>
        </div>
        
        <div>
          <Label htmlFor="resource_allocation" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Resource Allocation</Label>
          <textarea
            name="resource_allocation"
            id="resource_allocation"
            rows={3}
            value={formData.resource_allocation}
            onChange={handleChange}
            disabled={!isEditing || readOnly}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        
        <div>
          <Label htmlFor="equipment_requirements" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Equipment Requirements</Label>
          <textarea
            name="equipment_requirements"
            id="equipment_requirements"
            rows={3}
            value={formData.equipment_requirements}
            onChange={handleChange}
            disabled={!isEditing || readOnly}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>
    </SectionWrapper>
  );
});

function ProjectDetailForm({ project, setProject, activeSection, readOnly }) {
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
    current_worker_count: 0,
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
  const [currentTab, setCurrentTab] = useState(activeSection);
  const prevTabRef = useRef(activeSection);

  // Track active section changes without causing full re-renders
  useEffect(() => {
    if (activeSection !== prevTabRef.current) {
      setCurrentTab(activeSection);
      prevTabRef.current = activeSection;
    }
  }, [activeSection]);

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
        current_worker_count: project.current_worker_count || 0,
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

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  }, []);

  const handleLocationSelect = useCallback((location, lat, lng) => {
    setFormData(prev => ({
      ...prev,
      location,
      latitude: lat,
      longitude: lng
    }));
  }, []);

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

  const resetForm = useCallback(() => {
    setIsEditing(false);
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
        current_worker_count: project.current_worker_count || 0,
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

  // Define tabs for navigation
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <IconBuildingSkyscraper className="h-5 w-5" /> },
    { id: 'timeline', label: 'Timeline', icon: <IconCalendar className="h-5 w-5" /> },
    { id: 'workers', label: 'Workers', icon: <IconUsers className="h-5 w-5" /> },
    { id: 'suppliers', label: 'Suppliers', icon: <IconTruckDelivery className="h-5 w-5" /> },
    { id: 'risks', label: 'Risk Analysis', icon: <IconAlertTriangle className="h-5 w-5" /> }
  ];

  // Render the appropriate content based on the active tab
  // This is memoized to prevent unnecessary re-renders
  const renderTabContent = useCallback(() => {
    switch (currentTab) {
      case 'basic':
        return (
          <>
            {!readOnly && (
              <div className="flex justify-end mb-6">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-600"
                    >
                      <IconX className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <IconDeviceFloppy className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit Project
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <ProjectSummaryCard formData={formData} />

            <form>
              <BasicInfoSection 
                formData={formData} 
                handleChange={handleChange} 
                handleLocationSelect={handleLocationSelect}
                isEditing={isEditing}
                readOnly={readOnly}
              />
              
              <DescriptionSection 
                formData={formData} 
                handleChange={handleChange}
                isEditing={isEditing}
                readOnly={readOnly}
              />
              
              <RiskAssessmentSection 
                formData={formData} 
                handleChange={handleChange}
                isEditing={isEditing}
                readOnly={readOnly}
              />
              
              <ResourcesSection 
                formData={formData} 
                handleChange={handleChange}
                isEditing={isEditing}
                readOnly={readOnly}
              />
            </form>
          </>
        );
      case 'timeline':
        return project && (
          <ProjectTimeline 
            projectId={project.id} 
            readOnly={readOnly} 
          />
        );
      case 'workers':
        return project && (
          <ProjectWorkers 
            projectId={project.id} 
            supervisor={project.supervisor}
            readOnly={readOnly} 
          />
        );
      case 'suppliers':
        return project && (
          <ProjectSuppliers 
            projectId={project.id} 
            readOnly={readOnly} 
          />
        );
      case 'risks':
        return project && (
          <ProjectRisks 
            projectId={project.id} 
            readOnly={readOnly} 
          />
        );
      default:
        return null;
    }
  }, [
    currentTab, 
    project, 
    formData, 
    isEditing, 
    readOnly, 
    error,
    isSaving,
    handleChange,
    handleLocationSelect,
    handleSubmit,
    resetForm
  ]);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
      {/* Header with project title */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold">
          <ColourfulText text={project?.title || 'Project Details'} />
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pt-4">
        <TabNavigation 
          tabs={tabs} 
          activeTab={currentTab} 
          onChange={setCurrentTab} 
        />
      </div>

      {/* Tab Content with key to prevent re-rendering issues */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default React.memo(ProjectDetailForm);
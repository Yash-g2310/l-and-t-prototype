import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './layout/DashboardLayout';
import MapSelector from './project/MapSelector';
import { createProject } from '../services/projectService';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { GlowingEffect } from './ui/glowing-effect';
import { FloatingDock } from './ui/floating-dock'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconCalendar, 
  IconArrowLeft,
  IconLoader,
  IconBuilding,
  IconUsers,
  IconAlertTriangle,
  IconTruck,
  IconTools,
  IconClipboardCheck,
  IconArrowRight,
  IconMapPin
} from '@tabler/icons-react';

// --- Section Components OUTSIDE main component, with props ---
const BasicInfoSection = React.memo(function BasicInfoSection({ formData, handleChange, handleLocationSelect }) {
  return (
    <SectionWrapper 
      id="basic" 
      title="Project Basics" 
      icon={<IconBuilding className="h-6 w-6" />} 
      color="blue"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <Label htmlFor="title" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Project Title*</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter project title"
            className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="status" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Status</Label>
          <div className="relative">
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 pl-3 pr-10"
            >
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
        </div>
        <div>
          <Label htmlFor="budget" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Budget (₹)*</Label>
          <Input
            type="number"
            name="budget"
            id="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            min="0"
            placeholder="Enter budget amount"
            className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <Label htmlFor="start_date" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Start Date*</Label>
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
              required
              className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="end_date" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">End Date*</Label>
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
              required
              className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="estimated_workers" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Estimated Workers*</Label>
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
              required
              min="1"
              className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Number of workers"
            />
          </div>
        </div>
        <div className="col-span-2">
          <Label htmlFor="location" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Location*</Label>
          <div className="relative mb-3">
            <span className="absolute left-3 top-3 text-gray-400">
              <IconMapPin className="h-5 w-5" />
            </span>
            <Input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter location or select on map"
              className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="h-72 bg-gray-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
            <MapSelector
              initialLocation={{
                lat: formData.latitude || 28.6139,
                lng: formData.longitude || 77.2090
              }}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
});

const ProjectDetailsSection = React.memo(function ProjectDetailsSection({ formData, handleChange }) {
  return (
    <SectionWrapper 
      id="details" 
      title="Project Details" 
      icon={<IconClipboardCheck className="h-6 w-6" />} 
      color="indigo"
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="description" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Description*</Label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Provide a brief overview of the project"
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Technical details, specifications, and requirements"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Include detailed technical specifications, architectural considerations, and engineering requirements.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
});

const RiskManagementSection = React.memo(function RiskManagementSection({ formData, handleChange }) {
  return (
    <SectionWrapper 
      id="risks" 
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
            placeholder="Identify potential risks for this project (supply chain disruptions, workforce shortages, material costs, site conditions)"
          />
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/40">
          <div className="flex items-start mb-3">
            <IconAlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
            <h3 className="text-amber-800 dark:text-amber-300 font-medium">Why Risk Assessment Matters</h3>
          </div>
          <p className="text-amber-700 dark:text-amber-400 text-sm mb-2">
            Identifying risks early helps in creating mitigation strategies and contingency plans, potentially saving time and resources.
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
            placeholder="Strategies to mitigate identified risks"
          />
        </div>
      </div>
    </SectionWrapper>
  );
});

const ResourcesSection = React.memo(function ResourcesSection({ formData, handleChange }) {
  return (
    <SectionWrapper 
      id="resources" 
      title="Resources & Equipment" 
      icon={<IconTools className="h-6 w-6" />} 
      color="emerald"
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="flex items-center mb-2">
            <IconTruck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
            <Label htmlFor="supply_chain_requirements" className="text-gray-800 dark:text-gray-200 font-medium">Supply Chain Requirements</Label>
          </div>
          <textarea
            name="supply_chain_requirements"
            id="supply_chain_requirements"
            rows={3}
            value={formData.supply_chain_requirements}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Materials, equipment, and suppliers needed"
          />
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 shadow-sm">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Resource Planning Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2 mt-0.5">•</span>
              Identify critical resources that might face supply chain issues
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2 mt-0.5">•</span>
              Consider alternative suppliers for essential materials
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 mr-2 mt-0.5">•</span>
              Plan for potential resource constraints during peak construction periods
            </li>
          </ul>
        </div>
        <div>
          <Label htmlFor="resource_allocation" className="text-gray-800 dark:text-gray-200 font-medium mb-2 block">Resource Allocation</Label>
          <textarea
            name="resource_allocation"
            id="resource_allocation"
            rows={3}
            value={formData.resource_allocation}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="How resources will be allocated across the project"
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Specific equipment needed for this project"
          />
        </div>
      </div>
    </SectionWrapper>
  );
});

// --- SectionWrapper ---
const SectionWrapper = React.memo(({ id, title, icon, color, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    id={id}
    className="mb-10 scroll-mt-20"
  >
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-50/60 dark:from-${color}-950/30 dark:to-${color}-950/20 rounded-xl p-6 border border-${color}-100 dark:border-${color}-900/50 shadow-sm relative overflow-hidden`}>
      <div className="absolute inset-0 bg-white/80 dark:bg-black/10 backdrop-blur-[1px] z-0"></div>
      <GlowingEffect disabled={false} borderWidth={1.5} />
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
));

// --- Main Component ---
export default function CreateProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
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
    equipment_requirements: '',
  });

  // --- FIX: Only update changed field, don't recreate objects ---
  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      if (type === 'number') {
        if (prev[name] === Number(value)) return prev;
        return { ...prev, [name]: Number(value) };
      }
      if (prev[name] === value) return prev;
      return { ...prev, [name]: value };
    });
  }, []);

  const handleLocationSelect = useCallback((location, lat, lng) => {
    setFormData(prev => ({
      ...prev,
      location,
      latitude: lat,
      longitude: lng,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const result = await createProject(formData);
      navigate(`/projects/${result.id}`);
    } catch (err) {
      setError(err.detail || 'Failed to create project. Please try again.');
      setLoading(false);
    }
  };

  // --- Navigation logic (unchanged) ---
  const formSections = [
    { id: 'basic', label: 'Basic Info', icon: <IconBuilding className="h-5 w-5" />, color: 'blue' },
    { id: 'details', label: 'Project Details', icon: <IconClipboardCheck className="h-5 w-5" />, color: 'indigo' },
    { id: 'risks', label: 'Risk Management', icon: <IconAlertTriangle className="h-5 w-5" />, color: 'amber' },
    { id: 'resources', label: 'Resources', icon: <IconTools className="h-5 w-5" />, color: 'emerald' },
  ];

  const goToNextSection = (e) => {
    e.preventDefault();
    const currentIndex = formSections.findIndex((s) => s.id === activeSection);
    if (currentIndex < formSections.length - 1) {
      setActiveSection(formSections[currentIndex + 1].id);
    }
  };

  const goToPreviousSection = (e) => {
    e.preventDefault();
    const currentIndex = formSections.findIndex((s) => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(formSections[currentIndex - 1].id);
    }
  };

  // --- Floating Dock ---
  const dockItems = formSections.map(section => ({
    title: section.label,
    icon: React.cloneElement(section.icon, { 
      className: `text-${section.color}-600 dark:text-${section.color}-400` 
    }),
    href: `#${section.id}`,
    onClick: (e) => {
      e.preventDefault();
      setActiveSection(section.id);
    }
  }));

  // --- Redirect if not supervisor ---
  if (user?.role !== 'supervisor') {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg p-8 text-center max-w-md w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20 z-0"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <IconAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Access Restricted</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Only supervisors can create new projects</p>
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                Back to Projects
              </button>
            </div>
            <GlowingEffect disabled={false} borderWidth={1.5} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- Main Render ---
  return (
    <DashboardLayout>
      <div ref={containerRef} className="flex-1 h-full overflow-auto relative pb-28">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/10 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/20 z-0"></div>
          <div className="w-full p-8 relative z-10">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 group"
            >
              <IconArrowLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Projects</span>
            </button>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Create New Project
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
              Fill in the details to create a new construction project. Navigate between sections using the floating menu.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full px-6 py-8 bg-gray-50 dark:bg-neutral-900 flex-1">
          <div className="max-w-5xl mx-auto">
            {error && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-start">
                <IconAlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {activeSection === 'basic' && (
                  <BasicInfoSection
                    formData={formData}
                    handleChange={handleChange}
                    handleLocationSelect={handleLocationSelect}
                  />
                )}
                {activeSection === 'details' && (
                  <ProjectDetailsSection
                    formData={formData}
                    handleChange={handleChange}
                  />
                )}
                {activeSection === 'risks' && (
                  <RiskManagementSection
                    formData={formData}
                    handleChange={handleChange}
                  />
                )}
                {activeSection === 'resources' && (
                  <ResourcesSection
                    formData={formData}
                    handleChange={handleChange}
                  />
                )}
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pb-20">
                <button
                  type="button" 
                  onClick={goToPreviousSection}
                  className={`flex items-center px-5 py-2.5 rounded-lg ${
                    activeSection === 'basic' 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 shadow-sm'
                  }`}
                  disabled={activeSection === 'basic'}
                >
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </button>
                
                {activeSection !== 'resources' ? (
                  <button
                    type="button"
                    onClick={goToNextSection}
                    className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
                  >
                    Next
                    <IconArrowRight className="ml-2 h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <IconLoader className="h-5 w-5 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* The floating dock implementation */}
        <FloatingDock 
          items={dockItems}
          desktopClassName="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50" 
          mobileClassName="fixed bottom-6 right-6 z-50"
        />
      </div>
    </DashboardLayout>
  );
}
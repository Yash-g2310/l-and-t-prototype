import React, { useState, useEffect } from 'react';
import { 
  getProjectTimeline, 
  createTimelineEvent, 
  updateTimelineEvent 
} from '../../services/projectService';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconCalendarEvent,
  IconLoader2, 
  IconFlag
} from '@tabler/icons-react';

export default function ProjectTimeline({ projectId, readOnly }) {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    completion_percentage: 0,
    is_milestone: false,
    project: projectId
  });

  useEffect(() => {
    fetchTimelineEvents();
  }, [projectId]);

  const fetchTimelineEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await getProjectTimeline(projectId);
      // Sort by start date
      const sortedEvents = events.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      setTimelineEvents(sortedEvents);
    } catch (err) {
      setError(err.detail || 'Failed to load timeline events');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEventId) {
        await updateTimelineEvent(editingEventId, formData);
      } else {
        await createTimelineEvent(formData);
      }
      resetForm();
      fetchTimelineEvents();
    } catch (err) {
      setError(err.detail || 'Failed to save timeline event');
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      start_date: event.start_date.split('T')[0],
      end_date: event.end_date.split('T')[0],
      completion_percentage: event.completion_percentage,
      is_milestone: event.is_milestone,
      project: projectId
    });
    setEditingEventId(event.id);
    setIsAddingEvent(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      completion_percentage: 0,
      is_milestone: false,
      project: projectId
    });
    setEditingEventId(null);
    setIsAddingEvent(false);
  };

  // Function to generate a gradient based on completion percentage
  const getGradient = (percentage) => {
    if (percentage === 100) return 'bg-green-500 dark:bg-green-600';
    if (percentage >= 75) return 'bg-green-400 dark:bg-green-500';
    if (percentage >= 50) return 'bg-yellow-400 dark:bg-yellow-500';
    if (percentage >= 25) return 'bg-yellow-300 dark:bg-yellow-400';
    return 'bg-gray-300 dark:bg-gray-600';
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <IconLoader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading timeline...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Timeline</h3>
        
        {!readOnly && (
          <button
            onClick={() => setIsAddingEvent(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Add Event
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {isAddingEvent && !readOnly && (
        <div className="mb-6 bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            {editingEventId ? 'Edit Event' : 'Add New Event'}
          </h4>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
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
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
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
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="completion_percentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Completion (%)
              </label>
              <input
                type="number"
                name="completion_percentage"
                id="completion_percentage"
                min="0"
                max="100"
                value={formData.completion_percentage}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_milestone"
                id="is_milestone"
                checked={formData.is_milestone}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_milestone" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Is this a milestone?
              </label>
            </div>
            
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
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div className="col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {editingEventId ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {timelineEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <IconCalendarEvent className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
          <p>No timeline events have been added yet.</p>
          {!readOnly && (
            <p className="mt-2">Click "Add Event" to create the first timeline event.</p>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          {/* Timeline events */}
          <div className="space-y-8">
            {timelineEvents.map((event) => (
              <div key={event.id} className="relative flex items-start">
                {/* Timeline bullet */}
                <div className={`flex-shrink-0 h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 z-10 ${
                  event.is_milestone 
                    ? 'bg-yellow-500 dark:bg-yellow-600' 
                    : getGradient(event.completion_percentage)
                }`}>
                  {event.is_milestone && (
                    <IconFlag className="h-3 w-3 text-white mx-auto mt-0.5" />
                  )}
                </div>
                
                {/* Event content */}
                <div className="ml-4 flex-1 bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">
                        {event.title}
                        {event.is_milestone && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            Milestone
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {!readOnly && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                        >
                          <IconEdit className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {event.description}
                    </p>
                  )}
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {event.completion_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${getGradient(event.completion_percentage)} h-2 rounded-full`} 
                        style={{ width: `${event.completion_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
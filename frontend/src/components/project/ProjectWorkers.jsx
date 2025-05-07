import React, { useState, useEffect } from 'react';
import { 
  getProjectWorkers,
  addWorkerByEmail,
  removeWorker
} from '../../services/projectService';
import { 
  IconPlus, 
  IconUserPlus, 
  IconTrash, 
  IconLoader2,
  IconUserX
} from '@tabler/icons-react';

export default function ProjectWorkers({ projectId, supervisor, readOnly }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role_description: ''
  });

  useEffect(() => {
    fetchWorkers();
  }, [projectId]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectWorkers(projectId);
      setWorkers(data);
    } catch (err) {
      setError(err.detail || 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await addWorkerByEmail(projectId, formData.email, formData.role_description);
      setFormData({ email: '', role_description: '' });
      setIsAddingWorker(false);
      fetchWorkers();
    } catch (err) {
      setError(err.detail || 'Failed to add worker');
    }
  };

  const handleRemoveWorker = async (workerId) => {
    if (!window.confirm('Are you sure you want to remove this worker from the project?')) {
      return;
    }
    
    try {
      setError(null);
      await removeWorker(workerId);
      fetchWorkers();
    } catch (err) {
      setError(err.detail || 'Failed to remove worker');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <IconLoader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading workers...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Workers</h3>
        
        {!readOnly && (
          <button
            onClick={() => setIsAddingWorker(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <IconUserPlus className="h-4 w-4 mr-2" />
            Add Worker
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {isAddingWorker && !readOnly && (
        <div className="mb-6 bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Add Worker by Email
          </h4>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Worker Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="worker@example.com"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="role_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role/Description
              </label>
              <input
                type="text"
                name="role_description"
                id="role_description"
                value={formData.role_description}
                onChange={handleChange}
                placeholder="e.g. Electrician, Carpenter"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div className="col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingWorker(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Worker
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add supervisor card */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Project Supervisor</h4>
        
        <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {supervisor?.profile_picture ? (
                <img 
                  src={supervisor.profile_picture} 
                  alt={`${supervisor.first_name} ${supervisor.last_name}`}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {supervisor?.first_name?.[0] || supervisor?.username?.[0] || 'S'}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                {supervisor?.first_name} {supervisor?.last_name}
              </h5>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {supervisor?.email}
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                Project Supervisor
              </p>
            </div>
          </div>
        </div>
      </div>

      {workers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <IconUserX className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
          <p>No workers have been assigned to this project yet.</p>
          {!readOnly && (
            <p className="mt-2">Click "Add Worker" to assign workers to this project.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workers.map((workerData) => (
            <div 
              key={workerData.id} 
              className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {workerData.worker.profile_picture ? (
                      <img 
                        src={workerData.worker.profile_picture} 
                        alt={`${workerData.worker.first_name} ${workerData.worker.last_name}`}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {workerData.worker.first_name?.[0] || workerData.worker.username?.[0] || 'W'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      {workerData.worker.first_name} {workerData.worker.last_name}
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {workerData.worker.email}
                    </p>
                    {workerData.role_description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {workerData.role_description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Added: {new Date(workerData.assigned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {!readOnly && (
                  <button
                    onClick={() => handleRemoveWorker(workerData.id)}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
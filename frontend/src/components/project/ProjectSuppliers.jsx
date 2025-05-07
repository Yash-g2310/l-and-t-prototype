import React, { useState, useEffect } from 'react';
import { 
  getProjectSuppliers,
  createSupplier
} from '../../services/projectService';
import { 
  IconPlus, 
  IconLoader2,
  IconTrash,
  IconPackage,
  IconTruckDelivery,
  IconStar
} from '@tabler/icons-react';

export default function ProjectSuppliers({ projectId, readOnly }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    materials_provided: '',
    reliability_score: 80,
    lead_time_days: 7,
    project: projectId
  });

  useEffect(() => {
    if (projectId) {
      fetchSuppliers();
    }
  }, [projectId]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectSuppliers(projectId);
      setSuppliers(data);
    } catch (err) {
      setError(err.detail || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await createSupplier(formData);
      resetForm();
      setIsAddingSupplier(false);
      fetchSuppliers();
    } catch (err) {
      setError(err.detail || 'Failed to add supplier');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact_person: '',
      contact_email: '',
      contact_phone: '',
      materials_provided: '',
      reliability_score: 80,
      lead_time_days: 7,
      project: projectId
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <IconLoader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading suppliers...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Suppliers</h3>
        
        {!readOnly && (
          <button
            onClick={() => setIsAddingSupplier(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Add Supplier
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {isAddingSupplier && !readOnly && (
        <div className="mb-6 bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Add New Supplier
          </h4>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Supplier Name*
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Person
              </label>
              <input
                type="text"
                name="contact_person"
                id="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                id="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Phone
              </label>
              <input
                type="text"
                name="contact_phone"
                id="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div className="col-span-2">
              <label htmlFor="materials_provided" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Materials Provided*
              </label>
              <textarea
                name="materials_provided"
                id="materials_provided"
                rows="3"
                value={formData.materials_provided}
                onChange={handleChange}
                required
                placeholder="List materials this supplier provides..."
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="reliability_score" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reliability Score (0-100)
              </label>
              <input
                type="number"
                name="reliability_score"
                id="reliability_score"
                min="0"
                max="100"
                value={formData.reliability_score}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="lead_time_days" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Lead Time (days)
              </label>
              <input
                type="number"
                name="lead_time_days"
                id="lead_time_days"
                min="0"
                value={formData.lead_time_days}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div className="col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsAddingSupplier(false);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Supplier
              </button>
            </div>
          </form>
        </div>
      )}

      {suppliers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <IconPackage className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
          <p>No suppliers have been added to this project yet.</p>
          {!readOnly && (
            <p className="mt-2">Click "Add Supplier" to add materials providers to this project.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((supplier) => (
            <div 
              key={supplier.id} 
              className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex justify-between">
                <div className="w-full">
                  <div className="flex justify-between">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      {supplier.name}
                    </h5>
                    
                    <div className="flex items-center">
                      <IconStar className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {supplier.reliability_score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    {supplier.contact_person && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Contact:</span> {supplier.contact_person}
                      </p>
                    )}
                    
                    {supplier.contact_email && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Email:</span> {supplier.contact_email}
                      </p>
                    )}
                    
                    {supplier.contact_phone && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Phone:</span> {supplier.contact_phone}
                      </p>
                    )}
                    
                    <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <IconTruckDelivery className="h-3.5 w-3.5 mr-1 text-gray-500" />
                      <span>Lead time: <span className="font-medium">{supplier.lead_time_days} days</span></span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Materials:</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {supplier.materials_provided}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { 
  getProjectRisks,
  createRisk
} from '../../services/projectService';
import { 
  IconPlus, 
  IconLoader2,
  IconAlertCircle,
  IconShieldCheckFilled
} from '@tabler/icons-react';

export default function ProjectRisks({ projectId, readOnly }) {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    risk_level: 'medium',
    risk_category: 'other',
    probability: 0.5,
    impact: 5,
    mitigation_plan: '',
    contingency_plan: '',
    project: projectId
  });

  useEffect(() => {
    if (projectId) {
      fetchRisks();
    }
  }, [projectId]);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectRisks(projectId);
      setRisks(data);
    } catch (err) {
      setError(err.detail || 'Failed to load risks');
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
      await createRisk(formData);
      resetForm();
      setIsAddingRisk(false);
      fetchRisks();
    } catch (err) {
      setError(err.detail || 'Failed to add risk');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      risk_level: 'medium',
      risk_category: 'other',
      probability: 0.5,
      impact: 5,
      mitigation_plan: '',
      contingency_plan: '',
      project: projectId
    });
  };

  const getRiskLevelColor = (level) => {
    switch(level) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatRiskCategory = (category) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <IconLoader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading risk analysis...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Risk Analysis</h3>
        
        {!readOnly && (
          <button
            onClick={() => setIsAddingRisk(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Add Risk
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {isAddingRisk && !readOnly && (
        <div className="mb-6 bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Add New Risk
          </h4>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Risk Title*
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
              <label htmlFor="risk_category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Risk Category
              </label>
              <select
                name="risk_category"
                id="risk_category"
                value={formData.risk_category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="supply_chain">Supply Chain</option>
                <option value="workforce">Workforce</option>
                <option value="financial">Financial</option>
                <option value="weather">Weather/Environmental</option>
                <option value="technical">Technical</option>
                <option value="safety">Safety</option>
                <option value="regulatory">Regulatory</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description*
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the risk..."
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="risk_level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Risk Level
              </label>
              <select
                name="risk_level"
                id="risk_level"
                value={formData.risk_level}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="probability" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Probability (0-1)
                </label>
                <input
                  type="number"
                  name="probability"
                  id="probability"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.probability}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="impact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Impact (0-10)
                </label>
                <input
                  type="number"
                  name="impact"
                  id="impact"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.impact}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>
            
            <div className="col-span-2">
              <label htmlFor="mitigation_plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mitigation Plan*
              </label>
              <textarea
                name="mitigation_plan"
                id="mitigation_plan"
                rows="3"
                value={formData.mitigation_plan}
                onChange={handleChange}
                required
                placeholder="How will this risk be mitigated..."
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div className="col-span-2">
              <label htmlFor="contingency_plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contingency Plan
              </label>
              <textarea
                name="contingency_plan"
                id="contingency_plan"
                rows="3"
                value={formData.contingency_plan}
                onChange={handleChange}
                placeholder="What to do if this risk occurs..."
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            
            <div className="col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsAddingRisk(false);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Risk
              </button>
            </div>
          </form>
        </div>
      )}

      {risks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <IconShieldCheckFilled className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
          <p>No risks have been identified for this project yet.</p>
          {!readOnly && (
            <p className="mt-2">Click "Add Risk" to identify and analyze potential risks.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {risks.map((risk) => (
            <div 
              key={risk.id} 
              className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      {risk.title}
                    </h5>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRiskLevelColor(risk.risk_level)}`}>
                      {risk.risk_level}
                    </span>
                    
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {formatRiskCategory(risk.risk_category)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {risk.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Probability:</span> {(risk.probability * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Impact:</span> {risk.impact.toFixed(1)}/10
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Risk Score:</span> {(risk.probability * risk.impact).toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Mitigation Plan:</h6>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{risk.mitigation_plan}</p>
                    </div>
                    
                    {risk.contingency_plan && (
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Contingency Plan:</h6>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{risk.contingency_plan}</p>
                      </div>
                    )}
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
import React, { useState, useEffect } from 'react';
import { getMessages } from '../../services/projectService';
import { 
  IconLoader2,
  IconUserCircle,
  IconBell,
  IconClock,
  IconInfoCircle
} from '@tabler/icons-react';

export default function ProjectUpdates({ chatRoomId, projectTitle }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (chatRoomId) {
      fetchUpdates();
    }
  }, [chatRoomId]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      const messages = await getMessages(chatRoomId);
      
      // Filter for messages flagged as updates
      const projectUpdates = messages.filter(msg => msg.is_update);
      setUpdates(projectUpdates);
    } catch (err) {
      setError(err.detail || 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <IconLoader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading updates...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <IconInfoCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium">Project Updates</p>
            <p className="mt-1">This page shows all project updates shared by supervisors through the AI chat. Updates help keep all project members informed about progress, changes, and important developments.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {updates.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <IconBell className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
          <p>No updates have been posted for this project yet.</p>
          <p className="mt-2">Project updates will appear here when they're posted by supervisors.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-neutral-900 px-2 text-sm text-gray-500 dark:text-gray-400">
                Project Updates
              </span>
            </div>
          </div>
          
          <div className="flow-root">
            <ul className="-mb-8">
              {updates.map((update, idx) => (
                <li key={update.id}>
                  <div className="relative pb-8">
                    {idx !== updates.length - 1 ? (
                      <span
                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                        aria-hidden="true"
                      />
                    ) : null}
                    
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center ring-8 ring-white dark:ring-neutral-900">
                          <IconUserCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {update.sender.first_name} {update.sender.last_name}
                              </span>
                              <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full px-2 py-0.5">
                                Update
                              </span>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <IconClock className="h-3.5 w-3.5 mr-1" />
                              {formatDate(update.created_at)}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {update.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
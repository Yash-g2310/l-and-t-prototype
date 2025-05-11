import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMessages, sendMessage } from '../../services/projectService';
import { 
  IconSend, 
  IconLoader2,
  IconRobot,
  IconUserCircle,
  IconInfoCircle,
  IconClock
} from '@tabler/icons-react';
import { GlowingEffect } from '../ui/glowing-effect';

export default function ProjectChat({ chatRoomId, projectId, projectTitle, userRole }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState('');
  const [markAsUpdate, setMarkAsUpdate] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatRoomId) {
      fetchMessages();
      // Set up polling for new messages
      const intervalId = setInterval(fetchMessages, 10000); // Poll every 10 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [chatRoomId]);

  const fetchMessages = async () => {
    try {
      setError(null);
      console.log('Fetching messages for chat room:', chatRoomId);
      const data = await getMessages(chatRoomId);
      console.log('Messages retrieved:', data);
      setMessages(data);
      if (loading) setLoading(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.detail || 'Failed to load messages');
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    try {
      setSending(true);
      setError(null);
      
      console.log('Sending message to chatroom:', chatRoomId);
      console.log('Message content:', input);
      console.log('Is update:', markAsUpdate);
      
      // Send the message
      await sendMessage(chatRoomId, input, markAsUpdate);
      
      // Immediately fetch messages to show the response
      await fetchMessages();
      
      // Clear input and reset UI state
      setInput('');
      setMarkAsUpdate(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.detail || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <IconLoader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading conversation...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 relative">
        <GlowingEffect disabled={false} borderWidth={1} spread={20} />
        <div className="flex items-start relative z-10">
          <IconInfoCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium">Project AI Assistant</p>
            <p className="mt-1">Ask questions about this project, request updates, analyze risks, or get recommendations for optimizing resources and timelines.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div 
        ref={chatContainerRef}
        className="mb-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-gray-700 h-[400px] overflow-y-auto p-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <IconRobot className="h-12 w-12 mb-3 text-gray-400 dark:text-gray-600" />
            <p>No messages yet. Start the conversation by sending a message below.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.is_ai_response ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] ${message.is_ai_response ? 
                    'bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700' : 
                    message.is_update ? 
                      'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                      'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                  } rounded-lg p-3`}
                >
                  <div className="flex items-center mb-1">
                    <div className="flex items-center">
                      {message.is_ai_response ? (
                        <IconRobot className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      ) : (
                        <IconUserCircle className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-2" />
                      )}
                      <span className={`text-xs font-medium ${
                        message.is_ai_response ? 
                          'text-gray-700 dark:text-gray-300' : 
                          message.is_update ? 
                            'text-green-700 dark:text-green-300' : 
                            'text-indigo-700 dark:text-indigo-300'
                      }`}>
                        {message.is_ai_response ? 'AI Assistant' : `${message.sender.first_name || message.sender.username}`}
                        {message.is_update && ' (Update)'}
                      </span>
                    </div>
                    <div className="ml-2 flex items-center">
                      <IconClock className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatTimestamp(message.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`text-sm whitespace-pre-wrap ${
                    message.is_ai_response ? 
                      'text-gray-700 dark:text-gray-300' : 
                      message.is_update ? 
                        'text-green-700 dark:text-green-300' : 
                        'text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        {userRole === 'supervisor' && (
          <div className="mb-2 flex items-center">
            <input
              type="checkbox"
              id="mark-as-update"
              checked={markAsUpdate}
              onChange={(e) => setMarkAsUpdate(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-neutral-700"
            />
            <label htmlFor="mark-as-update" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Mark as project update
            </label>
          </div>
        )}
        
        <div className="flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask the AI about ${projectTitle}...`}
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-neutral-800 dark:text-white"
            rows="2"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
          >
            {sending ? (
              <IconLoader2 className="animate-spin h-5 w-5" />
            ) : (
              <IconSend className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
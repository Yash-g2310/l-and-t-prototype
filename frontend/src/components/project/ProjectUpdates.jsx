import React, { useState, useEffect } from 'react';
import { getMessages } from '../../services/projectService';
import { 
  IconLoader2,
  IconUserCircle,
  IconBell,
  IconInfoCircle,
  IconCalendarEvent,
  IconClock,
  IconUserSearch,
  IconUsers,
  IconCloud,
  IconTemperature,
  IconDroplet,
  IconWind,
  IconMapPin,
  IconAlertTriangle
} from '@tabler/icons-react';
import { GlowingEffect } from '../ui/glowing-effect';

export default function ProjectUpdates({ chatRoomId, projectTitle, userRole }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [forecastError, setForecastError] = useState(null);
  const [workData, setWorkData] = useState([]);

  // Base mock data for work hour allocation
  const workHourData = [
    { day: "Day 1", date: new Date(), hours: 6, worker: "Yash Gupta" },
    { day: "Day 2", date: new Date(Date.now() + 86400000), hours: 5, worker: "Yash Gupta" },
    { day: "Day 3", date: new Date(Date.now() + 86400000 * 2), hours: 7, worker: "Yash Gupta" },
    { day: "Day 4", date: new Date(Date.now() + 86400000 * 3), hours: 6, worker: "Yash Gupta" },
    { day: "Day 5", date: new Date(Date.now() + 86400000 * 4), hours: 7, worker: "Yash Gupta" },
    { day: "Day 6", date: new Date(Date.now() + 86400000 * 5), hours: 6, worker: "Yash Gupta" },
    { day: "Day 7", date: new Date(Date.now() + 86400000 * 6), hours: 8, worker: "Yash Gupta" },
    { day: "Day 8", date: new Date(Date.now() + 86400000 * 7), hours: 9, worker: "Yash Gupta" },
    { day: "Day 9", date: new Date(Date.now() + 86400000 * 8), hours: 6, worker: "Yash Gupta" },
    { day: "Day 10", date: new Date(Date.now() + 86400000 * 9), hours: 8, worker: "Yash Gupta" },
  ];

  useEffect(() => {
    if (chatRoomId) {
      fetchUpdates();
    }
    
    // Fetch weather data
    fetchWeather();
    fetchForecast();
  }, [chatRoomId]);

  // Combine work data with forecast data once forecast is loaded
  useEffect(() => {
    if (forecast) {
      const workWithWeather = workHourData.map(workDay => {
        // Find matching forecast day if available
        const workDate = workDay.date.toDateString();
        const forecastDay = forecast.find(f => f.date.toDateString() === workDate);
        
        return {
          ...workDay,
          weather: forecastDay || null
        };
      });
      
      setWorkData(workWithWeather);
    } else {
      setWorkData(workHourData);
    }
  }, [forecast]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching messages for updates from chat room:', chatRoomId);
      const messages = await getMessages(chatRoomId);
      
      // Filter for messages flagged as updates
      const projectUpdates = messages.filter(msg => msg.is_update);
      console.log('Found updates:', projectUpdates.length);
      setUpdates(projectUpdates);
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError(err.detail || 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);
      
      // Add your API key here
      const apiKey = '4d10c237db04cc95517f069912567646';
      
      // Use Delhi coordinates as default for the Smart City Metro Rail project
      // You can change these coordinates to match your project's actual location
      const lat = 28.6139;
      const lon = 77.2090;
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setWeatherError(err.message || 'Failed to load weather data');
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchForecast = async () => {
    try {
      setForecastLoading(true);
      setForecastError(null);
      
      // Add your API key here (same as the one used for current weather)
      const apiKey = '4d10c237db04cc95517f069912567646';
      
      // Use Delhi coordinates as default for the Smart City Metro Rail project
      const lat = 28.6139;
      const lon = 77.2090;
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      
      const data = await response.json();
      
      // Process forecast data to get daily forecasts (one per day)
      const dailyForecasts = processForecastData(data);
      setForecast(dailyForecasts);
    } catch (err) {
      console.error('Error fetching forecast:', err);
      setForecastError(err.message || 'Failed to load forecast data');
    } finally {
      setForecastLoading(false);
    }
  };

  // Process the 5-day/3-hour forecast data to get one forecast per day
  const processForecastData = (data) => {
    const dailyData = {};
    
    // Group forecast by day
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toDateString();
      
      if (!dailyData[day]) {
        dailyData[day] = {
          date: date,
          temps: [],
          humidity: [],
          weather: [],
          wind: [],
          icon: '',
          description: ''
        };
      }
      
      dailyData[day].temps.push(item.main.temp);
      dailyData[day].humidity.push(item.main.humidity);
      dailyData[day].weather.push(item.weather[0].main);
      dailyData[day].wind.push(item.wind.speed);
      
      // Use the noon forecast (or closest to it) for the day's icon and description
      const hour = date.getHours();
      if (hour >= 11 && hour <= 14) {
        dailyData[day].icon = item.weather[0].icon;
        dailyData[day].description = item.weather[0].description;
      }
    });
    
    // Convert to array and calculate averages
    const result = Object.values(dailyData).map(day => {
      // Set default icon and description if noon data wasn't found
      if (!day.icon && day.weather.length > 0) {
        const idx = Math.floor(day.weather.length / 2);
        day.icon = data.list[idx].weather[0].icon;
        day.description = data.list[idx].weather[0].description;
      }
      
      return {
        date: day.date,
        averageTemp: day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length,
        maxTemp: Math.max(...day.temps),
        minTemp: Math.min(...day.temps),
        averageHumidity: day.humidity.reduce((sum, hum) => sum + hum, 0) / day.humidity.length,
        averageWind: day.wind.reduce((sum, wind) => sum + wind, 0) / day.wind.length,
        icon: day.icon,
        description: day.description,
        mostFrequentWeather: getMostFrequent(day.weather)
      };
    });
    
    // Sort by date and limit to 10 days (to match our work data)
    return result.sort((a, b) => a.date - b.date).slice(0, 10);
  };

  // Helper function to find most frequent value in an array
  const getMostFrequent = (arr) => {
    const counts = {};
    let maxItem = arr[0];
    let maxCount = 1;
    
    for (const item of arr) {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        maxCount = counts[item];
        maxItem = item;
      }
    }
    
    return maxItem;
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
  
  const formatDay = (date) => {
    return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
  };

  const getWeatherStatus = (weather) => {
    if (!weather) return { color: "gray", text: "Unknown" };
    
    if (weather.maxTemp > 35) {
      return { color: "red", text: "Heat risk" };
    } else if (weather.minTemp < 10) {
      return { color: "blue", text: "Cold alert" };
    } else if (weather.averageWind > 20) {
      return { color: "yellow", text: "High winds" };
    } else if (weather.description.includes('rain')) {
      return { color: "indigo", text: "Rain expected" };
    } else {
      return { color: "green", text: "Favorable" };
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <IconLoader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading updates...</span>
      </div>
    );
  }

  // Find max hours for scaling
  const maxHours = Math.max(...workHourData.map(d => d.hours));

  return (
    <div className="p-6">
      <div className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 relative">
        <GlowingEffect disabled={false} borderWidth={1} spread={20} />
        <div className="flex items-start relative z-10">
          <IconInfoCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium">Project Updates</p>
            <p className="mt-1">This page shows all project updates shared by supervisors through the AI chat. Updates help keep all project members informed about progress, changes, and important developments.</p>
          </div>
        </div>
      </div>

      {/* Current Weather Section */}
      <div className="mb-8 mt-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-neutral-900 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <IconCloud className="mr-2 h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                Current Weather Conditions
              </div>
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative">
          <GlowingEffect disabled={false} borderWidth={1} spread={15} />
          
          {weatherLoading ? (
            <div className="p-8 text-center relative z-10">
              <IconLoader2 className="animate-spin h-6 w-6 mx-auto text-indigo-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Loading weather data...</p>
            </div>
          ) : weatherError ? (
            <div className="p-8 text-center relative z-10">
              <p className="text-red-500 dark:text-red-400">{weatherError}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Please check your API key or try again later.
              </p>
            </div>
          ) : weather ? (
            <div className="relative z-10">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <IconMapPin className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Weather in {weather.name}
                  </h3>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Weather Icon and Main */}
                  <div className="flex flex-col items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                      alt={weather.weather[0].description} 
                      className="w-16 h-16"
                    />
                    <div className="mt-2 text-center">
                      <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                        {weather.weather[0].description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Temperature */}
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <IconTemperature className="h-8 w-8 text-red-500 dark:text-red-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Temperature</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(weather.main.temp)}°C
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Feels like: {Math.round(weather.main.feels_like)}°C
                    </p>
                  </div>
                  
                  {/* Humidity */}
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <IconDroplet className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {weather.main.humidity}%
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${weather.main.humidity}%` }}></div>
                    </div>
                  </div>
                  
                  {/* Wind */}
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <IconWind className="h-8 w-8 text-green-500 dark:text-green-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(weather.wind.speed * 3.6)} km/h
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Direction: {weather.wind.deg}°
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <span className="font-medium">Safety Note:</span> Current weather conditions may 
                    {weather.main.temp > 35 ? " pose heat risks." : 
                     weather.main.temp < 10 ? " be too cold for certain tasks." :
                     weather.wind.speed > 20 ? " have high winds that affect scaffolding work." :
                     weather.rain ? " include rain that affects outdoor work." :
                     " be suitable for all scheduled work."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center relative z-10">
              <p className="text-gray-600 dark:text-gray-400">No weather data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Work Hours Allocation Section with Weather */}
      {userRole === 'worker' && (
      <div className="mb-8 mt-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-neutral-900 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <IconClock className="mr-2 h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                Work Hour Allocation with Weather Forecast
              </div>
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative">
          <GlowingEffect disabled={false} borderWidth={1} spread={15} />
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center relative z-10">
            <div className="flex items-center">
              <IconUserSearch className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Worker: Yash Gupta</h3>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <IconUsers className="h-4 w-4 mr-1" />
              <span>Site Worker</span>
            </div>
          </div>
          
          <div className="p-4 relative z-10">
            {/* CSS-based bar chart */}
            <div className="h-64 mb-6 flex items-end space-x-3">
              {workData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-indigo-600 rounded-t-md" 
                    style={{ 
                      height: `${(item.hours / 10) * 100}%`, 
                      maxHeight: '90%',
                      transition: 'height 0.5s ease-in-out'
                    }}
                  ></div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.day}</div>
                </div>
              ))}
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Day
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Hours Worked
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Weather
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {workData.map((item, index) => {
                    const weatherStatus = item.weather ? getWeatherStatus(item.weather) : { color: "gray", text: "Pending" };
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/20' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {item.day}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {formatDay(item.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {item.hours} hrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.weather ? (
                            <div className="flex items-center">
                              <img 
                                src={`https://openweathermap.org/img/wn/${item.weather.icon}.png`} 
                                alt={item.weather.description}
                                className="w-8 h-8 mr-2" 
                              />
                              <div>
                                <div className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                                  {item.weather.description}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {Math.round(item.weather.averageTemp)}°C / Wind: {Math.round(item.weather.averageWind * 3.6)} km/h
                                </div>
                              </div>
                            </div>
                          ) : forecastLoading ? (
                            <div className="flex items-center">
                              <IconLoader2 className="animate-spin h-4 w-4 text-indigo-600 mr-2" />
                              <span className="text-gray-500 dark:text-gray-400">Loading...</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Not available</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${weatherStatus.color}-100 text-${weatherStatus.color}-800 dark:bg-${weatherStatus.color}-900/30 dark:text-${weatherStatus.color}-300`}>
                            {item.weather ? (
                              <>
                                {weatherStatus.text === "Favorable" ? (
                                  <span className="flex items-center">
                                    <svg className="h-3 w-3 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {weatherStatus.text}
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <IconAlertTriangle className="h-3 w-3 mr-1" />
                                    {weatherStatus.text}
                                  </span>
                                )}
                              </>
                            ) : (
                              "Pending"
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-medium">Planning Note:</span> Use the weather forecast data to plan and schedule weather-sensitive tasks appropriately. Adjust work schedules and safety measures based on the forecasted conditions.
              </p>
            </div>
          </div>
        </div>
      </div>)}

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
                        <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 relative">
                          <GlowingEffect disabled={false} borderWidth={0.5} spread={15} />
                          <div className="flex items-center justify-between mb-2 relative z-10">
                            <div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {update.sender.first_name} {update.sender.last_name}
                              </span>
                              <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full px-2 py-0.5">
                                Update
                              </span>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <IconCalendarEvent className="h-3.5 w-3.5 mr-1" />
                              {formatDate(update.created_at)}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap relative z-10">
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
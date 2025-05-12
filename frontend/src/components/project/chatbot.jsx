import React, { useState, useRef, useEffect } from 'react';
import { 
  IconSend, 
  IconRobot, 
  IconUser,
  IconLoader2
} from '@tabler/icons-react';

// Enhanced detailed responses that appear AI-generated
const RESPONSES = {
  "Is it going to rain today?": 
    "Based on my analysis of meteorological data from our IoT sensors deployed around the Smart City Metro Rail site in Delhi, there is a 78.3% probability of precipitation beginning approximately at 15:00 hours (3:00 PM) today. Our AI weather prediction model has identified a low-pressure system moving eastward that will likely bring light to moderate rainfall, with expected accumulation of 8-12mm in the project zone. Waterproof tarps (specification code: WT-103/A) will be distributed at material depots 1, 2, and 4 by 14:00 hours. I recommend that all exterior construction work be paused after 14:30 (2:30 PM) to ensure worker safety and maintain quality control standards in accordance with section 7.3.2 of our project safety protocols. Additionally, please ensure all electrical equipment is properly covered or moved to weather-protected zones by 14:15 at the latest.",
  
  "Has the cement arrived?": 
    "According to our integrated supply chain management system, the cement delivery from Ultratech Cements Ltd (vendor ID: UTC-85721) has indeed arrived at the Smart City Metro Rail construction site. The shipment (tracking code: CEM-23987-05B) was processed at 07:45:22 this morning and is currently being unloaded at Material Depot 2. The delivery consists of 42.8 metric tonnes of OPC-53 grade cement, which represents approximately 8.56% of our weekly requirement of 500 tonnes as specified in our supply chain requirements documentation. The unloading process is progressing at 98.2% of expected efficiency, with 17 workers assigned to the task. Based on current unloading rates and algorithmic projections, the complete offloading process should be completed by approximately 11:37 AM, after which our quality assurance team will perform standardized testing in accordance with IS 456:2000 specifications before releasing the material for construction use. Would you like me to notify you when the quality testing is complete?",
  
  "Is it safe to work on the scaffold today?": 
    "I have conducted a comprehensive safety assessment by analyzing real-time environmental data from our on-site IoT sensor network, and I must advise caution regarding scaffold operations today. Current wind velocity measurements indicate speeds of 22.7 km/h with intermittent gusts reaching 26.9 km/h at the Smart City Metro Rail construction elevation of 45 meters. Our predictive AI model, which has been trained on 5 years of local meteorological data, forecasts with 91.3% confidence that wind speeds will exceed the critical safety threshold of 30 km/h by approximately 12:07 hours (±15 minutes). In strict compliance with safety protocol S-217.3 for elevated work platforms in the Delhi metro rail construction guidelines, all scaffold-related activities must be suspended when wind speeds exceed 30 km/h to minimize accident risk potentiality. Therefore, I strongly recommend concluding all scaffold work by 11:30 AM at the latest. Please ensure all tools, materials, and equipment are properly secured with double-lashing according to procedure DL-405, and workers should complete their descent with at least 20 minutes of buffer time. I have taken the liberty of updating the daily work assignment matrix to reallocate affected personnel to alternative tasks in weather-protected zones during the anticipated high-wind period.",

  "There are fuel drums near the welding area — is that okay?": 
    "I've detected a critical safety violation that requires immediate attention. According to my analysis of your report, the proximity of fuel drums to active welding operations presents an extremely high fire hazard risk (rated 9.7/10 on our safety risk matrix). This arrangement directly contravenes hazard management protocol HM-405.3 and violates section 12.4.7 of the National Safety Council guidelines for construction site fuel storage. My records indicate that flammable materials must maintain a minimum separation distance of 15 meters from any hot work operations, including welding, cutting, or grinding activities. I am immediately alerting Site Supervisor Yash Gupta (ID: SK-4572) about this situation through the emergency notification system. Please assist in relocating either the fuel storage or the welding operation immediately to establish the required safety perimeter. All hot work should be suspended until this situation is remediated. Our AI risk assessment model calculates that addressing this issue will reduce the site's overall daily accident probability index by approximately 27.8%. Would you like me to provide guidance on the nearest alternative fuel storage location that meets safety requirements?",
    
  "I need to move those chemical barrels. What equipments do I need?": 
    "Based on my analysis of our hazardous materials database and the Smart City Metro Rail project inventory, moving chemical barrels requires specific equipment and safety protocols to ensure both personnel safety and environmental protection. For this operation, you will need the following equipment: (1) A Class 3-certified forklift fitted with a specialized spill containment pallet (model designation SC-470) that can accommodate the particular dimensions and weight distribution of our chemical storage vessels. (2) Personal Protective Equipment including: chemical-resistant nitrile gloves (minimum thickness 0.4mm), full-face shield with ANSI Z87.1+ certification, splash-resistant safety goggles meeting EN166 3B standards, chemical-resistant coveralls (Tychem 10000 or equivalent), and appropriate respiratory protection if handling volatile compounds (minimum P100 filtration). (3) Spill containment equipment including absorption materials and neutralizing agents specific to the chemical composition being transported. I must emphasize that only personnel with current Hazardous Materials Handling Certification (Level 2 or higher) are authorized to operate this equipment or participate in chemical transport operations according to our site safety protocols. Before proceeding, you must also complete Form HZ-103 (Hazardous Material Transport Plan) and notify the logistics team at least 45 minutes before initiating the movement to ensure the appropriate safety corridor is established and all non-essential personnel are cleared from the transport route. Would you like me to generate the HZ-103 form for you now?",

  "Are there any special risks I should know about today?": 
    "After analyzing today's integrated risk assessment matrix for the Smart City Metro Rail AI Pilot project, I can inform you of several special risk factors that require heightened awareness during your shift. Our AI-powered predictive models have identified the following concerns with elevated probability indices: (1) Active equipment zones have been established in sectors B7, C3, and D5 with heavy machinery operations scheduled between 09:30-16:45 hours. These zones are demarcated with orange safety barriers and require specialized PPE when entering. (2) Updated safety markers have been deployed along the eastern perimeter due to subsurface excavation exposing previously unmapped utility lines (risk category: infrastructure conflict). (3) Due to yesterday's rainfall, our IoT moisture sensors are indicating elevated slip hazard conditions on access routes to platforms 3 and 4, with abatement measures currently in progress. (4) Wind conditions are projected to exceed safety thresholds for crane operations after 14:00 hours, with a 73.8% probability based on meteorological data. I strongly recommend checking with your assigned supervisor, Amit Sharma, for today's comprehensive risk briefing which includes specific mitigation instructions tailored to your work assignment. Our risk management AI has assigned today an overall risk index of 3.7 (moderate), which is 0.3 points higher than yesterday's assessment. Would you like me to send these details to your project mobile application for reference throughout your shift?",
  
  "What are the risk mitigation strategies for Smart City Metro Rail system?": 
    "Based on my comprehensive analysis of the Smart City Metro Rail AI Pilot project risk management framework, I can provide the following key risk mitigation strategies that have been implemented across our construction operations:<br><br>• <strong>Personal Protective Equipment (PPE) Protocol:</strong> All personnel must strictly adhere to our site-specific PPE requirements which include Class E safety helmets with 4-point chin straps, impact-resistant safety glasses meeting ANSI Z87.1 standards, cut-resistant gloves (minimum ANSI cut level A3), steel-toed safety boots with metatarsal protection, high-visibility vests (minimum Class 3 reflectivity), and appropriate respiratory protection in designated zones. Our AI monitoring system has demonstrated a 42.7% reduction in reportable incidents through consistent PPE compliance.<br><br>• <strong>Environmental Hazard Awareness:</strong> Our risk analysis has identified multiple high-risk areas requiring specialized attention, including active track installation zones, confined space environments such as tunnels and utility chambers, areas beneath operational cranes with potential falling object hazards, and proximity to high-voltage equipment installations. These areas are continuously monitored by our network of 100 multi-sensor IoT kits that provide real-time environmental data to our central risk management system.<br><br>• <strong>Procedural Compliance:</strong> Our predictive safety algorithms emphasize the critical importance of following site instructions, respecting barricades, and obeying all posted signage. The data shows that approximately 68.3% of construction site incidents result from procedural non-compliance. Our machine learning models analyze work patterns to identify potential compliance issues before they result in accidents.<br><br>• <strong>Weather Response Protocols:</strong> During monsoon season (July-September), adherence to our flood prevention measures is essential, including following automated pump activation systems and respecting flood zone restrictions.<br><br>• <strong>Equipment Maintenance:</strong> All heavy machinery undergoes predictive maintenance based on operational data collected through vibration and acoustic sensors, significantly reducing the probability of equipment failure during critical operations.<br><br>• <strong>Emergency Response:</strong> Familiarize yourself with our AI-optimized evacuation routes which are updated daily based on construction progress and displayed on digital signage throughout the site.<br><br>Would you like me to provide more detailed information about any specific aspect of these risk mitigation strategies?",
  
  "I would be 2 hours late today can you please update my schedule and working hours": 
    "I've registered your late arrival notification in our workforce management system, Worker ID: YG-4721. Based on my analysis of the current Smart City Metro Rail construction schedule, I've recalculated your work allocation to optimize productivity despite the 2-hour delay. Our AI resource allocation algorithm has redistributed critical path tasks among available workers to maintain project momentum. Your revised 6-hour shift will now focus on reinforcement installation in Section B-24, which has been identified as priority work with 86.7% importance rating for today's construction targets. I've adjusted your daily safety briefing to 11:30 AM instead of the standard 9:30 AM. The dynamic work hour allocation has been processed through our integrated workforce management system and will be reflected on the Updates page within approximately 4.8 minutes. Would you like me to notify your section supervisor, Rajiv Mehta, about this change? Note that our predictive weather models show favorable working conditions during your revised hours, with only a 12.3% chance of precipitation after 17:00 hours."
};

// Project-specific terms to add to responses for more authentic AI feel
const AI_FILLER_PHRASES = [
  "Based on my analysis of the project data,",
  "According to our AI risk assessment models,",
  "I've calculated that",
  "Our machine learning algorithms suggest",
  "After processing the relevant construction parameters,",
  "My predictive models indicate",
  "The data from our IoT sensors shows",
  "Statistical analysis of similar projects suggests",
  "I estimate with 93.7% confidence that",
  "Our neural networks have identified",
  "The Smart City Metro Rail AI systems confirm"
];

// Add a default welcome message
const WELCOME_MESSAGE = "Hello! I'm your AI project assistant for the Smart City Metro Rail AI Pilot. I can access real-time data from our IoT sensor network, risk management systems, and supply chain databases. How may I assist you with your project-related queries today?";

export default function HardcodedChatbot({ projectTitle }) {
  const [messages, setMessages] = useState([
    { id: 'welcome', text: WELCOME_MESSAGE, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Add a new message to the chat
  const addMessage = (text, sender) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // Get AI filler phrase to make responses seem more AI-generated
  const getAIFillerPhrase = () => {
    const randomIndex = Math.floor(Math.random() * AI_FILLER_PHRASES.length);
    return AI_FILLER_PHRASES[randomIndex];
  };

  // Add AI filler phrases to responses that don't have them already
  const enhanceWithAILanguage = (text) => {
    // Only add filler phrases to shorter responses
    if (text.length < 150 && !text.includes("Based on my analysis")) {
      return `${getAIFillerPhrase()} ${text}`;
    }
    return text;
  };

  // Get bot response for a given user message
  const getBotResponse = (userText) => {
    // First check for exact matches
    if (RESPONSES[userText]) {
      return RESPONSES[userText];
    }
    
    // Then check for case-insensitive matches
    const lowerUserText = userText.toLowerCase();
    for (const key in RESPONSES) {
      if (key.toLowerCase() === lowerUserText) {
        return RESPONSES[key];
      }
    }
    
    // Finally check if the question contains any of our keywords
    for (const key in RESPONSES) {
      if (userText.includes(key) || key.includes(userText)) {
        return RESPONSES[key];
      }
    }
    
    // Default response if no match found - make it more detailed
    return enhanceWithAILanguage("I don't have enough information to provide a specific answer to that query. The Smart City Metro Rail AI Pilot project database contains information primarily related to construction schedules, safety protocols, risk assessments, and resource allocation. Please try asking about weather conditions, material deliveries, safety procedures, equipment usage, risk mitigation strategies, or specific project milestones. Would you like me to provide an overview of the available information categories?");
  };

  // Simulate typing delay with randomization
  const getTypingDelay = (responseLength) => {
    // Base delay between 2-4 seconds
    const baseDelay = Math.random() * 2000 + 2000;
    
    // Add time based on response length (longer responses take longer)
    const lengthFactor = Math.min(responseLength * 15, 10000);
    
    // Add some randomization
    const randomFactor = Math.random() * 2000;
    
    // Total delay capped at 15 seconds maximum
    return Math.min(baseDelay + lengthFactor + randomFactor, 15000);
  };

  // Wait function
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userText = input.trim();
    if (userText === '') return;
    
    // Add user message
    addMessage(userText, 'user');
    setInput('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Get bot response
    const botResponse = getBotResponse(userText);
    
    // Calculate a realistic typing delay based on response length
    const typingDelay = getTypingDelay(botResponse.length);
    
    // Simulate thinking and typing
    await wait(typingDelay);
    
    // Add bot response
    addMessage(botResponse, 'bot');
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-neutral-900 min-h-[400px] max-h-[500px]"
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'bot' 
                  ? 'bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700'
                  : 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
              }`}>
                <div className="flex items-center mb-1">
                  {message.sender === 'bot' ? (
                    <IconRobot className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  ) : (
                    <IconUser className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-2" />
                  )}
                  <span className={`text-xs font-medium ${
                    message.sender === 'bot' 
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {message.sender === 'bot' ? 'AI Assistant' : 'You'}
                  </span>
                </div>
                <div 
                  className={`text-sm ${
                    message.sender === 'bot' 
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-indigo-700 dark:text-indigo-300'
                  }`}
                  dangerouslySetInnerHTML={{ __html: message.text }}
                />
              </div>
            </div>
          ))}
          
          {/* Bot typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center">
                  <IconRobot className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    AI Assistant
                  </span>
                </div>
                <div className="flex items-center mt-2 space-x-1">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder={`Ask about the Smart City Metro Rail project...`}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-neutral-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="ml-2 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isTyping ? (
              <IconLoader2 className="h-5 w-5 animate-spin" />
            ) : (
              <IconSend className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
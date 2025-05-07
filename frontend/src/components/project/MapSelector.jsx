import React, { useState, useEffect, useRef } from 'react';

export default function MapSelector({ initialLocation, onLocationSelect }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  
  // Initialize map
  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, []);
  
  const initializeMap = () => {
    // For demonstration, using a fallback without API key
    // In production, always use your Google Maps API key
    
    // Create a simple map implementation if Google Maps isn't available
    const fallbackMap = {
      setCenter: () => {},
      addListener: () => {},
    };
    
    const fallbackMarker = {
      setPosition: () => {},
      getPosition: () => ({ lat: () => 28.6139, lng: () => 77.2090 }),
    };
    
    try {
      if (window.google && window.google.maps) {
        // Real Google Maps implementation
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: initialLocation?.lat || 28.6139, lng: initialLocation?.lng || 77.2090 },
          zoom: 10,
          mapTypeId: 'roadmap',
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        
        const markerInstance = new window.google.maps.Marker({
          position: { lat: initialLocation?.lat || 28.6139, lng: initialLocation?.lng || 77.2090 },
          map: mapInstance,
          draggable: true,
        });
        
        window.google.maps.event.addListener(markerInstance, 'dragend', handleMarkerDrag);
        window.google.maps.event.addListener(mapInstance, 'click', (e) => {
          markerInstance.setPosition(e.latLng);
          handleMarkerDrag();
        });
        
        setMap(mapInstance);
        setMarker(markerInstance);
        
        // Setup search box if available
        if (window.google.maps.places) {
          const searchBox = new window.google.maps.places.SearchBox(
            document.getElementById('map-search-input')
          );
          
          mapInstance.addListener('bounds_changed', () => {
            searchBox.setBounds(mapInstance.getBounds());
          });
          
          searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            if (places.length === 0) return;
            
            const place = places[0];
            if (!place.geometry) return;
            
            if (place.geometry.viewport) {
              mapInstance.fitBounds(place.geometry.viewport);
            } else {
              mapInstance.setCenter(place.geometry.location);
              mapInstance.setZoom(17);
            }
            
            markerInstance.setPosition(place.geometry.location);
            handleMarkerDrag();
          });
        }
      } else {
        // Fallback for demonstration
        setMap(fallbackMap);
        setMarker(fallbackMarker);
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      setMap(fallbackMap);
      setMarker(fallbackMarker);
    }
  };
  
  const handleMarkerDrag = () => {
    if (marker && onLocationSelect) {
      const position = marker.getPosition();
      const lat = position.lat();
      const lng = position.lng();
      
      // Reverse geocode to get address
      if (window.google && window.google.maps && window.google.maps.Geocoder) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            onLocationSelect(results[0].formatted_address, lat, lng);
          } else {
            onLocationSelect(`Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`, lat, lng);
          }
        });
      } else {
        // Fallback
        onLocationSelect(`Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`, lat, lng);
      }
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // This is just a fallback if the Places API search box isn't working
    if (searchValue && window.google && window.google.maps && window.google.maps.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchValue }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          map.setCenter(location);
          marker.setPosition(location);
          handleMarkerDrag();
        }
      });
    }
  };
  
  return (
    <div className="h-full relative">
      <div className="absolute top-2 left-2 right-2 z-10 flex">
        <input
          id="map-search-input"
          type="text"
          placeholder="Search location..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="px-3 py-2 w-full rounded-l-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={handleSearch}
          className="px-3 py-2 bg-indigo-600 text-white rounded-r-md"
        >
          Search
        </button>
      </div>
      <div ref={mapRef} className="h-full" />
      {!window.google && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Map preview unavailable.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              To enable maps, add your Google Maps API key to the environment variables.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
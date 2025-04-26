import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import Navbar from "../components/Navbar";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAwu-8dNJLI059da_fzQQtxubB9JB1qi5c",
});

function Upload() {
  const [image, setImage] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Rate limiting logic
  const MAX_REQUESTS = 2;
  const COOLDOWN_PERIOD = 60; // 60 seconds (1 minute)

  useEffect(() => {
    // Load request count from localStorage
    const savedRequestCount = localStorage.getItem('requestCount');
    const savedTimestamp = localStorage.getItem('requestTimestamp');
    
    if (savedRequestCount && savedTimestamp) {
      const elapsedTime = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
      
      if (elapsedTime < COOLDOWN_PERIOD) {
        setRequestCount(parseInt(savedRequestCount));
        if (parseInt(savedRequestCount) >= MAX_REQUESTS) {
          setCooldownActive(true);
          setCooldownTimer(COOLDOWN_PERIOD - elapsedTime);
        }
      } else {
        // Reset if cooldown period has passed
        resetRateLimits();
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    if (cooldownActive && cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setCooldownActive(false);
            resetRateLimits();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [cooldownActive, cooldownTimer]);

  const resetRateLimits = () => {
    setRequestCount(0);
    setCooldownActive(false);
    setCooldownTimer(0);
    localStorage.setItem('requestCount', '0');
    localStorage.setItem('requestTimestamp', Date.now().toString());
  };

  const incrementRequestCount = () => {
    const newCount = requestCount + 1;
    setRequestCount(newCount);
    localStorage.setItem('requestCount', newCount.toString());
    localStorage.setItem('requestTimestamp', Date.now().toString());
    
    if (newCount >= MAX_REQUESTS) {
      setCooldownActive(true);
      setCooldownTimer(COOLDOWN_PERIOD);
      setShowModal(true);
    }
  };

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedImage = event.target.files[0];
      setImage(selectedImage);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
      
      // Reset results when new image is uploaded
      setResponseText("");
      setFoodItems([]);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    if (cooldownActive) {
      setShowModal(true);
      return;
    }

    incrementRequestCount();
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async () => {
      const base64Image = reader.result.split(",")[1]; // Remove data:image/png;base64, prefix

      try {
        const response = await ai.models.generateContent({
          model: "gemini-1.5-pro",
          contents: [
            { 
              type: "text", 
              text: "Identify the food items in this image. Return as a JSON array with objects containing 'name', 'description', 'calories' (estimated calories per serving), and 'protein' (estimated protein in grams) properties for each food item." 
            },
            { 
              type: "inlineData", 
              inlineData: { mimeType: image.type, data: base64Image } 
            },
          ],
        });

        const responseText = response.text || "No food items detected.";
        setResponseText(responseText);
        
        try {
          // Try to parse the response as JSON
          // Handle cases where the response contains JSON inside a code block
          let jsonText = responseText;
          
          // Check if the response is wrapped in ```json ... ``` or similar
          const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
          const match = jsonRegex.exec(jsonText);
          if (match && match[1]) {
            jsonText = match[1];
          }
          
          const parsedItems = JSON.parse(jsonText);
          if (Array.isArray(parsedItems)) {
            setFoodItems(parsedItems);
          } else {
            // If response is not an array, create a default item
            setFoodItems([{ name: "Food Detected", description: responseText, calories: "Unknown", protein: "Unknown" }]);
          }
        } catch (e) {
          console.error("Error parsing JSON:", e);
          // If not valid JSON, create a default item
          setFoodItems([{ name: "Food Detected", description: responseText, calories: "Unknown", protein: "Unknown" }]);
        }
      } catch (error) {
        console.error("Error detecting food items:", error);
        setResponseText("Failed to detect food items.");
        setFoodItems([]);
      } finally {
        setLoading(false);
      }
    };
  };

  // Function to format calories text nicely
  const formatCalories = (calories) => {
    if (!calories) return "Unknown calories";
    
    // If it's a range like "200-300"
    if (calories.includes("-")) {
      return `${calories} calories`;
    }
    
    // If it's just a number
    if (!isNaN(calories)) {
      return `${calories} calories`;
    }
    
    // Return as is if it already has "cal" or "calories"
    if (calories.toLowerCase().includes("cal")) {
      return calories;
    }
    
    return `${calories} calories`;
  };

  // Function to format protein text nicely
  const formatProtein = (protein) => {
    if (!protein) return "Unknown protein";
    
    // If it's a range like "10-15"
    if (protein.includes("-")) {
      return `${protein}g protein`;
    }
    
    // If it's just a number
    if (!isNaN(protein)) {
      return `${protein}g protein`;
    }
    
    // Return as is if it already has "g" or "protein"
    if (protein.toLowerCase().includes("g") || protein.toLowerCase().includes("protein")) {
      return protein;
    }
    
    return `${protein}g protein`;
  };

  return (
   <>
   <Navbar />
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Food Detection AI</h1>
      
      {/* Rate Limit Indicator */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {cooldownActive ? (
            <span className="text-red-500">Cooldown: {cooldownTimer}s remaining</span>
          ) : (
            <span>{requestCount}/{MAX_REQUESTS} requests this minute</span>
          )}
        </div>
        
        {requestCount > 0 && !cooldownActive && (
          <div className="h-2 flex-1 ml-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{width: `${(requestCount / MAX_REQUESTS) * 100}%`}}
            ></div>
          </div>
        )}
      </div>
      
      {/* Upload and Action Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload Food Image
          </label>
          <div className="flex items-center gap-2">
            <label className="flex-1 cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-center hover:bg-gray-100">
              <span className="text-blue-600">Choose File</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden"
              />
            </label>
            <button 
              onClick={analyzeImage} 
              disabled={!image || loading || cooldownActive}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Detect Food"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Preview */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Image Preview</h2>
          <div className="bg-gray-100 rounded-lg overflow-hidden" style={{minHeight: "240px"}}>
            {preview ? (
              <img 
                src={preview} 
                alt="Uploaded food" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-full py-12">
                <p className="text-gray-400 text-sm">No image uploaded</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Results */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Detection Results</h2>
          
          {loading && (
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Analyzing image...</p>
            </div>
          )}
          
          {!loading && foodItems.length === 0 && responseText === "" && (
            <div className="text-center py-12 text-gray-500">
              Upload an image and click "Detect Food" to analyze
            </div>
          )}
          
          {!loading && foodItems.length > 0 && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="p-3">
                <h3 className="font-bold text-lg text-gray-800 mb-2">We've identified {foodItems.length} item{foodItems.length > 1 ? 's' : ''}</h3>
                
                {foodItems.map((item, index) => (
                  <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-gray-800 text-lg">{item.name}</h4>
                    </div>
                    
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {formatCalories(item.calories)}
                      </span>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {formatProtein(item.protein)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mt-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!loading && foodItems.length === 0 && responseText !== "" && (
            <div className="text-center py-6 text-gray-500">
              {responseText}
            </div>
          )}
        </div>
      </div>
      
      {/* Rate Limit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Model Execution Limit Reached</h3>
              <p className="text-gray-500 mb-4">
                You've exceeded the limit of {MAX_REQUESTS} requests per minute. Please wait {cooldownTimer} seconds before trying again.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
   </>
  );
}

export default Upload;
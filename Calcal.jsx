import React, { useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import Navbar from "../components/Navbar";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAwu-8dNJLI059da_fzQQtxubB9JB1qi5c",
});

function NutritionRecommendation() {
  // Create a ref for the results section
  const resultsRef = useRef(null);
  
  // User information state
  const [userInfo, setUserInfo] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "male",
    dietType: "omnivore", // default to omnivore
    activityLevel: "moderate",
  });

  // Available options for dropdown menus
  const dietTypes = [
    { value: "omnivore", label: "Omnivore (Standard)" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "pescatarian", label: "Pescatarian" },
    { value: "paleo", label: "Paleo" },
    { value: "keto", label: "Keto" },
  ];

  const activityLevels = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    { value: "light", label: "Light (light exercise 1-3 days/week)" },
    { value: "moderate", label: "Moderate (moderate exercise 3-5 days/week)" },
    { value: "active", label: "Active (hard exercise 6-7 days/week)" },
    { value: "very_active", label: "Very Active (very hard exercise & physical job or training twice a day)" },
  ];

  // Recommendation state
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  // Validate form
  const validateForm = () => {
    if (!userInfo.age || !userInfo.weight || !userInfo.height) {
      setError("Please fill in all required fields: age, weight, and height.");
      return false;
    }
    
    // Basic validation for numeric inputs
    if (isNaN(userInfo.age) || isNaN(userInfo.weight) || isNaN(userInfo.height)) {
      setError("Age, weight, and height must be numbers.");
      return false;
    }
    
    // Age range check
    if (userInfo.age < 13 || userInfo.age > 100) {
      setError("Age must be between 13 and 100 years.");
      return false;
    }
    
    setError("");
    return true;
  };

  // Generate nutrition recommendations using Gemini API
  const generateRecommendations = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setRecommendations(null);
    
    try {
      const prompt = `
As a nutrition expert, provide personalized daily nutritional recommendations for the following individual:
- Age: ${userInfo.age} years
- Gender: ${userInfo.gender}
- Weight: ${userInfo.weight} kg
- Height: ${userInfo.height} cm
- Diet Type: ${userInfo.dietType}
- Activity Level: ${userInfo.activityLevel}

Provide a detailed breakdown of the following in JSON format:
1. Daily calorie needs
2. Macronutrients (protein, carbs, fat) in grams and percentage
3. Essential vitamins and minerals with recommended daily amounts
4. Hydration needs
5. Three specific food recommendations to meet nutritional needs based on the person's diet type

Return the information in the following JSON format:
{
  "calories": {
    "total": number,
    "breakdown": {
      "bmr": number,
      "activity": number
    }
  },
  "macronutrients": {
    "protein": {
      "grams": number,
      "percentage": number
    },
    "carbs": {
      "grams": number,
      "percentage": number
    },
    "fat": {
      "grams": number,
      "percentage": number
    }
  },
  "vitamins_minerals": [
    {"name": string, "amount": string, "food_sources": [string, string]},
    ...
  ],
  "hydration": {"amount_ml": number, "cups": number},
  "food_recommendations": [string, string, string]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: [{ type: "text", text: prompt }],
      });

      const responseText = response.text || "";
      
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
        
        const parsedRecommendations = JSON.parse(jsonText);
        setRecommendations(parsedRecommendations);
        
        // Scroll to results after a short delay to ensure the component has rendered
        setTimeout(() => {
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        setError("Failed to process the nutrition recommendations. Please try again.");
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setError("Failed to generate recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Personalized Nutrition Recommendations
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Your Information
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Age */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Age (years) *
              </label>
              <input
                type="number"
                name="age"
                value={userInfo.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="13"
                max="100"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={userInfo.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                value={userInfo.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="30"
                max="300"
                required
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                name="height"
                value={userInfo.height}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="100"
                max="250"
                required
              />
            </div>

            {/* Diet Type */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Diet Type
              </label>
              <select
                name="dietType"
                value={userInfo.dietType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dietTypes.map((diet) => (
                  <option key={diet.value} value={diet.value}>
                    {diet.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Activity Level
              </label>
              <select
                name="activityLevel"
                value={userInfo.activityLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {activityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateRecommendations}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "Generating Recommendations..." : "Get Nutritional Recommendations"}
          </button>
        </div>

        {/* Results Section */}
        <div ref={resultsRef}>
          {loading && (
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Analyzing your nutritional needs...</p>
            </div>
          )}

          {recommendations && !loading && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-green-700 border-b pb-2">
                Your Personalized Nutrition Plan
              </h2>

              {/* Calories Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Daily Calorie Needs</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-blue-700">{recommendations.calories.total}</span>
                    <span className="text-lg text-blue-600 ml-2">calories</span>
                  </div>
                  <div className="grid grid-cols-2 mt-3 gap-2 text-sm text-center">
                    <div className="bg-white p-2 rounded">
                      <div className="font-semibold">Base Metabolic Rate</div>
                      <div>{recommendations.calories.breakdown.bmr} cal</div>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <div className="font-semibold">Activity Adjustment</div>
                      <div>+{recommendations.calories.breakdown.activity} cal</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Macronutrients Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Macronutrients</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-center mb-1">
                      <span className="text-sm uppercase font-semibold text-green-700">Protein</span>
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-green-600">{recommendations.macronutrients.protein.grams}</span>
                      <span className="text-lg ml-1">g</span>
                    </div>
                    <div className="text-center text-sm text-green-600">
                      {recommendations.macronutrients.protein.percentage}% of calories
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-center mb-1">
                      <span className="text-sm uppercase font-semibold text-yellow-700">Carbs</span>
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-yellow-600">{recommendations.macronutrients.carbs.grams}</span>
                      <span className="text-lg ml-1">g</span>
                    </div>
                    <div className="text-center text-sm text-yellow-600">
                      {recommendations.macronutrients.carbs.percentage}% of calories
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-center mb-1">
                      <span className="text-sm uppercase font-semibold text-purple-700">Fat</span>
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-purple-600">{recommendations.macronutrients.fat.grams}</span>
                      <span className="text-lg ml-1">g</span>
                    </div>
                    <div className="text-center text-sm text-purple-600">
                      {recommendations.macronutrients.fat.percentage}% of calories
                    </div>
                  </div>
                </div>
              </div>

              {/* Vitamins & Minerals Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Essential Vitamins & Minerals</h3>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nutrient
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Daily Need
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Food Sources
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recommendations.vitamins_minerals.map((nutrient, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">
                            {nutrient.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {nutrient.amount}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {nutrient.food_sources.join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hydration Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Hydration Needs</h3>
                <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700">
                      {recommendations.hydration.amount_ml} ml
                    </div>
                    <div className="text-gray-600 mt-1">
                      About {recommendations.hydration.cups} cups of water per day
                    </div>
                  </div>
                </div>
              </div>

              {/* Food Recommendations */}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Recommended Foods</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {recommendations.food_recommendations.map((food, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white text-xs mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 text-sm text-gray-500 italic">
                Note: These recommendations are generated by AI for informational purposes only. 
                Always consult with a healthcare provider or registered dietitian before making 
                significant changes to your diet.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NutritionRecommendation;
import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md my-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          About NutriSmart
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-4">
            At NutriSmart, we believe everyone deserves personalized nutrition guidance that fits 
            their unique lifestyle and health goals. Our AI-powered platform provides science-backed 
            recommendations tailored to your specific needs, making healthy eating simple and accessible.
          </p>
          <p className="text-gray-600 mb-4">
            Founded in 2024, our team of nutrition experts and technology specialists 
            have created an innovative solution that brings professional-level nutrition 
            advice to everyone, anywhere, anytime.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            What We Offer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-blue-700 mb-2">Precise Calorie Prediction</h3>
              <p className="text-sm text-gray-600">
                Get accurate daily calorie requirements based on your age, weight, height, gender, and activity level.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM3.5 10a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" clipRule="evenodd" />
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-700 mb-2">Macronutrient Balance</h3>
              <p className="text-sm text-gray-600">
                Discover your optimal protein, carbohydrate, and fat ratios for energy and health maintenance.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-purple-700 mb-2">Personalized Food Recommendations</h3>
              <p className="text-sm text-gray-600">
                Receive customized food suggestions that align with your dietary preferences and nutritional needs.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Our Advanced Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Essential Nutrient Tracking:</strong> Monitor your vitamin and mineral intake for optimal health.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Diet-Specific Recommendations:</strong> Whether you're vegan, keto, or omnivore, we've got you covered.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Hydration Guidance:</strong> Personalized daily water intake recommendations based on your profile.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>AI-Powered Suggestions:</strong> Food recommendations that adapt to your specific nutritional profile.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            How It Works
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 p-4 border rounded-lg bg-gray-50">
              <div className="text-center mb-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white text-lg font-bold">1</span>
              </div>
              <h3 className="text-center font-medium mb-2">Enter Your Details</h3>
              <p className="text-sm text-center text-gray-600">
                Provide your basic information including age, weight, height, gender, and activity level.
              </p>
            </div>
            <div className="flex-1 p-4 border rounded-lg bg-gray-50">
              <div className="text-center mb-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white text-lg font-bold">2</span>
              </div>
              <h3 className="text-center font-medium mb-2">AI Analysis</h3>
              <p className="text-sm text-center text-gray-600">
                Our advanced AI processes your information to create a personalized nutrition profile.
              </p>
            </div>
            <div className="flex-1 p-4 border rounded-lg bg-gray-50">
              <div className="text-center mb-2">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white text-lg font-bold">3</span>
              </div>
              <h3 className="text-center font-medium mb-2">Get Recommendations</h3>
              <p className="text-sm text-center text-gray-600">
                Receive detailed nutrition guidance including calories, macros, and food suggestions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link to="/calcal" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Try Our Nutrition Calculator
          </Link>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            navigate("/login");
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`http://localhost:5900/api/users/${userId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch user information");
                }

                setUser(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleFoodCaloriesClick = () => {
        navigate("/upload");
    };

    const handleNutritionRecommendations = () => {
        navigate("/calcal");
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white flex flex-col items-center p-6">
                <div className="max-w-4xl w-full mt-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Food Protein Detection App</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover the nutritional content of your food and get personalized 
                            recommendations to maintain a healthy diet.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div 
                            className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            onClick={handleFoodCaloriesClick}
                            style={{cursor: "pointer"}}
                        >
                            <div className="bg-blue-50 p-6">
                                <img 
                                    src="https://d12oja0ew7x0i8.cloudfront.net/images/Article_Images/ImageForArticle_18331(1).jpg" 
                                    alt="Food Analysis" 
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Check Food Calories & Proteins</h2>
                                <p className="text-gray-600 mb-4">
                                    Upload images of your food to instantly analyze calories, 
                                    protein content, and other nutritional information.
                                </p>
                                <button 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-300"
                                    onClick={handleFoodCaloriesClick}
                                >
                                    Analyze Food
                                </button>
                            </div>
                        </div>
                        
                        <div 
                            className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            onClick={handleNutritionRecommendations}
                            style={{cursor: "pointer"}}
                        >
                            <div className="bg-green-50 p-6">
                                <img 
                                    src="http://dpcedcenter.org/wp-content/uploads/2018/05/ChooseMyPlate-Healthy-Food-and-Plate-of-USDA-Balanced-Diet-Recommendation-168340083_2122x1415-1024x683.jpeg" 
                                    alt="Nutrition Recommendations" 
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Get Nutrition Recommendations</h2>
                                <p className="text-gray-600 mb-4">
                                    Receive personalized diet recommendations based on your 
                                    profile, goals, and dietary preferences.
                                </p>
                                <button 
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors duration-300"
                                    onClick={handleNutritionRecommendations}
                                >
                                    Get Recommendations
                                </button>
                            </div>
                        </div>
                    </div>

                    {user && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 text-sm">Full Name</span>
                                    <p className="font-medium text-gray-800">{user.fullName}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 text-sm">Email Address</span>
                                    <p className="font-medium text-gray-800">{user.email}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 text-sm">Gender</span>
                                    <p className="font-medium text-gray-800 capitalize">{user.gender}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 text-sm">Contact Number</span>
                                    <p className="font-medium text-gray-800">{user.contactNumber}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!user && (
                        <div className="flex justify-center my-8">
                            <div className="animate-pulse flex space-x-4 w-full max-w-2xl">
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HomePage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProgress } from '../services/userAssessmentProgressService'
import { fetchUserDetailsById } from "../services/userAssessmentProgressService";
export default function WelcomePage() {

    const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

   useEffect(() => {
      const getUserDetails = async () => {
        const userDetails = await fetchUserDetailsById();
        setUserDetails(userDetails);
      };
      getUserDetails();
    }, []);
  useEffect(() => {
    fetchUserProgress()
      .then((progress) => {
        if (progress?.currentStage === null) {
          navigate("/report"); // redirect if already done
        } else {
          setLoading(false); // show welcome content
        }
      })
      .catch((err) => {
        console.error("Failed to fetch progress", err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-7xl w-full p-8">
        {/* Greeting */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Dear <span className="text-blue-600">{userDetails?.fullName}</span>
        </h2>

        {/* Intro */}
        <h3 className="text-xl font-semibold mb-4">Welcome to ByTrait!</h3>
        <p className="text-gray-700 mb-4 leading-relaxed">
          We’re thrilled to have you embark on a journey of self-discovery and
          career exploration. Our personality and career interest tests are
          designed to uncover your unique traits and passions, guiding you
          towards a career path that aligns with who you are.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Through our comprehensive assessments, you'll gain insights into your
          personality strengths and career inclinations. We’ll map out detailed
          career paths tailored to your individuality, offering the most
          suitable options that resonate with your personality and aspirations.
        </p>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Get ready to uncover new insights, explore exciting possibilities, and
          pave the way towards a fulfilling career that reflects the best of
          you. Let's embark on this enlightening journey together!
        </p>

        {/* Video */}
        <p className="font-medium text-gray-900 mb-3">
          Please watch the video below before you begin
        </p>
         <div>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/gxx6rqKimzQ?si=VdQAaaCm0Hxh971d"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/assessment")}
          >
            Let&apos;s Start
          </button>
        </div>
      </div>
    </div>
  );
}

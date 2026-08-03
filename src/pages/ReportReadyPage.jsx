import React, { useEffect, useState } from "react";
import congrasIms from "../assets/congrats.png";
import { fetchUserDetailsById } from "../services/userAssessmentProgressService";

export default function ReportReadyPage() {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      const details = await fetchUserDetailsById();
      setUserDetails(details);
    };
    getUserDetails();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <img
        src={congrasIms}
        alt="Congratulations"
        className="w-32 h-32 mb-6"
      />

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-blue-900">
        Congratulations{userDetails?.fullName ? `, ${userDetails.fullName}` : ""}!
      </h1>

      <p className="text-xl text-center mb-4 font-semibold text-gray-800 max-w-2xl">
        Your career report has been generated.
      </p>

      <p className="text-lg text-center text-gray-700 max-w-2xl mb-2">
        Please collect it from your counsellor.
      </p>

      <p className="text-base text-center text-gray-500 max-w-xl mt-6">
        Thank you for completing the assessment. Your counsellor will share your
        personalized career report with you.
      </p>
    </div>
  );
}

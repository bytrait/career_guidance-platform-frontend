import { useEffect, useState } from "react";
import CounsellorLayout from "../../components/counsellor/layout/CounsellorLayout";
import StatsCard from "../../components/counsellor/dashboard/StatsCard";
import QuickActions from "../../components/counsellor/dashboard/QuickActions";
import { getCreditSummary } from "../../services/billingService";
import { getCounsellorSchools, getCounsellorStudents } from "../../services/counsellorService";

export default function Dashboard() {
    const [studentsCount, setStudentsCount] = useState(0);
    const [schoolsCount, setSchoolsCount] = useState(0);
    const [availableCredits, setAvailableCredits] = useState(0);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch students
            const studentsRes = await getCounsellorStudents({
                page: 1,
                limit: 1
            });
            setStudentsCount(studentsRes.meta.total);

            // Fetch schools
            const schoolsRes = await getCounsellorSchools();
            setSchoolsCount(schoolsRes.length);

            // Fetch credits
            const creditRes = await getCreditSummary();
            setAvailableCredits(creditRes.availableCredits);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        }
    };

    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-bold text-gray-800">
                Overview
            </h1>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatsCard
                    title="Total Students"
                    value={studentsCount}
                />

                <StatsCard
                    title="Schools"
                    value={schoolsCount}
                />

                <StatsCard
                    title="Available Credits"
                    value={availableCredits}
                />
            </div>

            {/* Quick Actions */}
            <QuickActions />

        </div>
    );
}

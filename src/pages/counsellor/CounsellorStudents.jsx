import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { getCounsellorStudents } from '../../services/counsellorService';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/common/Spinner';

const CounsellorStudents = () => {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState('');


    const limit = 10;

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await getCounsellorStudents({
                page,
                limit,
                search: debouncedSearch,
            });

            setStudents(res.data);
            setMeta(res.meta);
        } catch (err) {
            console.error('Failed to fetch students', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page, debouncedSearch]);


    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(1);
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">
                My Students
            </h1>

            {/* Search */}
            <input
                type="text"
                placeholder="Search by name or email"
                className="border p-2 rounded w-full mb-4"
                value={search}
                onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                }}
            />

            {/* Render spinner while loading */}
            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <Spinner />
                </div>
            ) : students.length === 0 ? (
                <div className="text-gray-500 text-center mt-10">
                    No students found.
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="overflow-x-auto relative">
                        <table className="w-full border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 text-left">Name</th>
                                    <th className="p-2 text-left">Email</th>
                                    <th className="p-2 text-left">Contact</th>
                                    <th className="p-2 text-left">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="border-t cursor-pointer hover:bg-gray-50"
                                        onClick={() =>
                                            navigate(`/counsellor/students/${student.id}/report`)
                                        }
                                    >
                                        <td className="p-2">{student.fullName}</td>
                                        <td className="p-2">{student.email}</td>
                                        <td className="p-2">{student.contact}</td>
                                        <td className="p-2">
                                            {new Date(student.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="mt-6 flex justify-center">
                            <Pagination
                                page={meta.page}
                                totalPages={meta.totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CounsellorStudents;

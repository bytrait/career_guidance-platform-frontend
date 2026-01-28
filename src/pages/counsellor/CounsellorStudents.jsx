import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCounsellorStudents } from '../../services/counsellorService';
import { getReferenceCode } from '../../services/auth';

import Pagination from '../../components/Pagination';
import Spinner from '../../components/common/Spinner';

const CounsellorStudents = () => {
  const navigate = useNavigate();

  // -----------------------
  // Existing state
  // -----------------------
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // -----------------------
  // NEW: Reference Code state
  // -----------------------
  const [referenceCode, setReferenceCode] = useState('');
  const [copied, setCopied] = useState(false);

  const limit = 10;

  // -----------------------
  // Fetch students (UNCHANGED)
  // -----------------------
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

  // -----------------------
  // Fetch reference code (NEW)
  // -----------------------
  useEffect(() => {
    const fetchReferenceCode = async () => {
      try {
        const code = await getReferenceCode();
        setReferenceCode(code);
        console.log('Reference code fetched:', code);
      } catch (err) {
        console.error('Failed to fetch reference code', err);
      }
    };

    fetchReferenceCode();
  }, []);

  // -----------------------
  // Effects (UNCHANGED)
  // -----------------------
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

  // -----------------------
  // Copy reference code (NEW)
  // -----------------------
  const handleCopy = async () => {
    if (!referenceCode) return;

    await navigator.clipboard.writeText(referenceCode);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-6">
      {/* --------------------------------
          Reference Code Card (NEW)
      -------------------------------- */}
      {referenceCode && (
        <div className="mb-6 rounded-lg border bg-gradient-to-r from-indigo-50 to-blue-50 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Your Counsellor Reference Code
            </p>
            <p className="text-3xl font-bold tracking-widest text-indigo-700">
              {referenceCode}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Share this code with students during registration
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
            title="Copy reference code"
          >
            <i className="bi bi-clipboard text-lg"></i>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}

      {/* --------------------------------
          Existing UI (UNCHANGED)
      -------------------------------- */}
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

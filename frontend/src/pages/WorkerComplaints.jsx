import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/Auth";

const formatTimestamp1 = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const getStatusClass = (status) => {
  const currentStatus = status || "Assigned";
  switch (currentStatus) {
    case "Assigned":
      return "bg-blue-600";
    case "Work_Completed":
      return "bg-yellow-600 text-black";
    case "Verified":
      return "bg-green-500";
    default:
      return "bg-blue-600";
  }
};

const getStatusText = (status) => {
  const currentStatus = status || "Assigned";
  return currentStatus.replace("_", " ");
};

const WorkerComplaints = () => {
  const { headers } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const getComplaints = async (e) => {
    try {
      const response = await fetch("http://localhost:3000/complaints", {
        method: "GET",
        headers: headers,
      });
      const jsonData = await response.json();
      setComplaints(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getComplaints();
  }, []);

  const handleWorkerComplete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/complaints/worker-complete/${id}`,
        {
          method: "PUT",
          headers: headers,
        }
      );

      if (response.ok) {
        getComplaints(); // Refresh list
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.msg || errData.error}`);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const currentStatus = complaint.status || "Assigned";
    const categoryMatch =
      filterCategory === "All" || complaint.category === filterCategory;
    const statusMatch =
      filterStatus === "All" || currentStatus === filterStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <div className="bg-gray-100 p-4 sm:p-8 md:p-10 min-h-screen">
      {/* --- MODIFIED: Wrapped Title and Filters in a flex container --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-20 mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">My Assigned Tasks</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="All">All Categories</option>
              <option value="Electric">Electric</option>
              <option value="Water">Water</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Assigned">Assigned</option>
              <option value="Work_Completed">Work Completed</option>
              <option value="Verified">Verified</option>
            </select>
          </div>
        </div>
      </div>
      {/* --- END MODIFICATION --- */}

      {filteredComplaints.length === 0 ? (
        <p className="ml-4 mt-2 text-gray-600 text-xl">
          You have no assigned tasks for this filter.
        </p>
      ) : (
        <div className="container mx-auto grid gap-8 md:grid-cols-3 sm:grid-cols-1">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="relative flex h-full flex-col rounded-md border border-gray-200 bg-white p-2.5 sm:rounded-lg sm:p-5"
            >
              <div className="text-lg mb-2 font-semibold text-gray-900 sm:text-2xl">
                {complaint.name} (Room No.{complaint.room})
              </div>
              <p className="text-sm font-semibold text-blue-600 mb-2">
                Category: {complaint.category}
              </p>
              <p className="text-sm">
                Created on {formatTimestamp1(complaint.created_at)}
              </p>
              <div className="text-md leading-normal text-gray-400 sm:block my-4">
                {complaint.description}
              </div>
              <div className="mt-auto p-2 bg-gray-50 rounded-md border">
                <p className="text-sm font-semibold">Submitted by:</p>
                <p className="text-sm">{complaint.user_id.full_name}</p>
                <p className="text-sm">
                  Block: {complaint.block_id.block_name}
                </p>
              </div>

              {(complaint.status === "Assigned" || !complaint.status) && (
                <button
                  className={`group flex w-full mt-3 cursor-pointer items-center justify-center rounded-md px-4 py-2 text-white transition text-sm ${getStatusClass(
                    complaint.status
                  )}`}
                  onClick={() => handleWorkerComplete(complaint._id)}
                >
                  Mark as Done
                </button>
              )}

              {(complaint.status === "Work_Completed" ||
                complaint.status === "Verified") && (
                <button
                  className={`group flex w-full mt-3 cursor-not-allowed items-center justify-center rounded-md px-4 py-2 text-white transition text-sm ${getStatusClass(
                    complaint.status
                  )}`}
                  disabled
                >
                  {getStatusText(complaint.status)}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerComplaints;
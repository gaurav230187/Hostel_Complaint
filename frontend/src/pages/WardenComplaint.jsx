import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/Auth";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
const formatTimestamp1 = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

// ... (AssignWorkerModal component remains unchanged)
const AssignWorkerModal = ({ show, onClose, workers, onAssign }) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  useEffect(() => {
    if (show && workers.length > 0) {
      setSelectedWorkerId(workers[0]._id);
    } else if (show) {
      setSelectedWorkerId("");
    }
  }, [show, workers]);

  if (!show) {
    return null;
  }

  const handleSubmit = () => {
    if (selectedWorkerId) {
      onAssign(selectedWorkerId);
    } else {
      alert("Please select a worker.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Assign Worker</h2>
        {workers.length > 0 ? (
          <>
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            >
              {workers.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.full_name} ({worker.specialization})
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              No workers found for this category/block. Please register a worker
              first.
            </p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// --- END AssignWorkerModal ---

const WardenComplaints = () => {
  const { headers } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComplaintId, setCurrentComplaintId] = useState(null);
  const [workersForModal, setWorkersForModal] = useState([]);

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

  const getWorkers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/workers", {
        method: "GET",
        headers: headers,
      });
      const jsonData = await response.json();
      setWorkers(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleVerification = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/complaints/${id}`, {
        method: "PUT",
        headers: headers,
      });
      console.log(response);
      getComplaints();
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getComplaints();
    getWorkers();
  }, []);

  const deleteComplaint = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/complaints/${id}`, {
        method: "DELETE",
        headers: headers,
      });

      if (response.ok) {
        setComplaints(complaints.filter((complaint) => complaint._id !== id));
      } else {
        console.error("Failed to delete complaint");
      }
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  const handleAssignWorker = async (workerId) => {
    if (!currentComplaintId || !workerId) return;
    try {
      const response = await fetch(
        `http://localhost:3000/complaints/assign/${currentComplaintId}`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({ worker_id: workerId }),
        }
      );
      if (response.ok) {
        setIsModalOpen(false);
        setCurrentComplaintId(null);
        getComplaints();
      } else {
        console.error("Failed to assign worker");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const currentStatus = complaint.status || "Pending"; // Default to Pending
    const categoryMatch =
      filterCategory === "All" || complaint.category === filterCategory;
    const statusMatch =
      filterStatus === "All" || currentStatus === filterStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <>
      <AssignWorkerModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workers={workersForModal}
        onAssign={handleAssignWorker}
      />

      <div className="bg-gray-100 p-4 sm:p-8 md:p-10 min-h-screen">
        {/* --- MODIFIED: Wrapped Title and Filters in a flex container --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-20 mb-8">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Complaints</h1>
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
                <option value="Pending">Pending</option>
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
            No complaints found for the selected filters.
          </p>
        ) : (
          <div className="container mx-auto grid gap-8 md:grid-cols-3 sm:grid-cols-1">
            {filteredComplaints.map((complaint) => {
              const currentStatus = complaint.status || "Pending";
              return (
                <div
                  key={complaint._id}
                  className="relative flex h-full flex-col rounded-md border border-gray-200 bg-white p-2.5 hover:border-gray-400 sm:rounded-lg sm:p-5"
                >
                  <div className="text-lg mb-2 font-semibold text-gray-900 hover:text-black sm:mb-1.5 sm:text-2xl">
                    {complaint.name} (Room No.{complaint.room})
                  </div>
                  <p className="text-sm font-semibold text-blue-600 mb-2">
                    Category: {complaint.category}
                  </p>
                  <p className="text-sm">
                    Created on {formatTimestamp1(complaint.created_at)}
                  </p>
                  <p className="mb-4 text-sm">
                    {complaint.verified_at
                      ? `Verified on ${formatTimestamp(complaint.verified_at)}`
                      : null}
                  </p>
                  <div className="text-md leading-normal text-gray-400 sm:block">
                    {complaint.description}
                  </div>

                  <div className="mt-4 mb-4 p-2 bg-gray-50 rounded-md border">
                    <p className="text-sm font-semibold">Submitted by:</p>
                    <p className="text-sm">
                      {complaint.user_id.full_name} (Room:{" "}
                      {complaint.user_id.room})
                    </p>
                  </div>

                  <div className="flex flex-col mt-auto">
                    {currentStatus === "Pending" && (
                      <button
                        className="group flex w-full sm:w-auto mt-3 cursor-pointer items-center justify-center rounded-md px-4 py-2 text-white transition text-sm bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          const relevantWorkers = workers.filter(
                            (w) =>
                              w.specialization === complaint.category ||
                              complaint.category === "Other"
                          );
                          setWorkersForModal(relevantWorkers);
                          setCurrentComplaintId(complaint._id);
                          setIsModalOpen(true);
                        }}
                      >
                        Assign Worker
                      </button>
                    )}

                    {currentStatus === "Assigned" && (
                      <div className="w-full mt-3 p-3 bg-blue-100 text-blue-800 rounded-md text-sm text-center font-semibold">
                        Assigned to: {complaint.assigned_to.full_name}
                      </div>
                    )}

                    {currentStatus === "Work_Completed" && (
                      <button
                        className="group flex w-full sm:w-auto mt-3 cursor-pointer items-center justify-center rounded-md px-4 py-2 text-black transition text-sm bg-yellow-400 hover:bg-yellow-500"
                        onClick={() => handleVerification(complaint._id)}
                      >
                        Verify Completion
                      </button>
                    )}

                    {currentStatus === "Verified" && (
                      <button
                        className="group flex w-full sm:w-auto mt-3 cursor-not-allowed items-center justify-center rounded-md px-4 py-2 text-white transition text-sm bg-green-500"
                        disabled
                      >
                        Verified
                      </button>
                    )}

                    {currentStatus !== "Verified" && (
                      <button
                        className="group flex w-full sm:w-auto mt-3 cursor-pointer items-center justify-center rounded-md px-4 py-2 text-white transition text-sm bg-red-600"
                        onClick={() => deleteComplaint(complaint._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default WardenComplaints;
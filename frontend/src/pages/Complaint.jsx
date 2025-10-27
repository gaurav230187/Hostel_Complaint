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

// --- UPDATED HELPER FUNCTIONS ---
const getStatusClass = (status) => {
  const currentStatus = status || "Pending"; // Default to Pending if undefined
  switch (currentStatus) {
    case "Pending":
      return "bg-red-600";
    case "Assigned":
      return "bg-blue-600";
    case "Work_Completed":
      return "bg-yellow-600 text-black";
    case "Verified":
      return "bg-green-500";
    default:
      return "bg-red-600";
  }
};

const getStatusText = (status) => {
  const currentStatus = status || "Pending"; // Default to Pending if undefined
  return currentStatus.replace("_", " ");
};
// --- END UPDATED HELPERS ---

const ComplaintForm = () => {
  // ... (ComplaintForm component remains unchanged)
  const { authToken, headers } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [room, setRoom] = useState("");
  const [category, setCategory] = useState("Other");

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!name || name.trim() === "") {
      alert("Please enter a valid name.");
      return;
    }
    if (!room || room.trim() === "") {
      alert("Please enter Room No.");
      return;
    }
    if (!description || description.trim() === "") {
      alert("Please enter a valid complaint.");
      return;
    }

    try {
      const body = { name, description, room, category };
      const response = await fetch("http://localhost:3000/complaints", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div class="border border-gray-100 shadow-gray-500/20 w-full bg-white shadow-sm sm:rounded-lg sm:shadow-lg">
      <div class="relative border-b border-gray-300 p-4 py-8 sm:px-8">
        <h3 class="mb-1 inline-block text-3xl font-medium">
          <span class="mr-4">Submit Complaint</span>
          <span class="inline-block rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-700 sm:inline">
            Quick Response
          </span>
        </h3>
        <p class="text-gray-600">Contact us for hostel grievance redressal</p>
      </div>
      <div class="p-4 sm:p-8">
        <input
          id="name"
          type="text"
          class="mt-1 w-full resize-y overflow-auto rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none hover:border-blue-500"
          placeholder="Enter Complaint name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          id="email"
          type="text"
          class="peer mt-8 w-full resize-y overflow-auto rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none hover:border-blue-500"
          placeholder="Enter your Room No."
          onChange={(e) => setRoom(e.target.value)}
        />

        <label className="mt-5 mb-2 inline-block max-w-full">Category</label>
        <select
          id="category"
          class="peer mt-1 w-full resize-y overflow-auto rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none hover:border-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Other">Other</option>
          <option value="Electric">Electric</option>
          <option value="Water">Water</option>
          <option value="Carpentry">Carpentry</option>
        </select>

        <label class="mt-5 mb-2 inline-block max-w-full">
          Tell us about your grievance
        </label>
        <textarea
          id="about"
          class="mb-8 w-full resize-y overflow-auto rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none hover:border-blue-500"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button
          class="w-full rounded-lg border border-blue-700 bg-blue-700 p-3 text-center font-medium text-white outline-none transition focus:ring hover:border-blue-700 hover:bg-blue-600 hover:text-white"
          onClick={onSubmitForm}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
// --- END ComplaintForm ---

const Complaint = () => {
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
      <div className="bg-gray-100 p-4 sm:p-8 md:p-10 min-h-screen">
        <h1 className="text-2xl font-bold mt-20 mb-8">Your Dashboard</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 w-full">
            <h2 className="text-xl font-semibold mb-4">
              Your Submitted Complaints
            </h2>

            {/* --- FILTER UI --- */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
            {/* --- END FILTER UI --- */}

            {filteredComplaints.length === 0 ? (
              <p className="ml-4 mt-2 text-gray-600 text-xl">
                No complaints registered yet or found for this filter.
              </p>
            ) : (
              <div className="container mx-auto grid gap-8 md:grid-cols-2 sm:grid-cols-1">
                {filteredComplaints.map((complaint) => (
                  <div
                    key={complaint._id}
                    className="relative flex h-full flex-col rounded-md border border-gray-200 bg-white p-2.5 hover:border-gray-400 sm:rounded-lg sm:p-5"
                  >
                    <div className="text-lg mb-2 font-semibold text-gray-900 hover:text-black sm:mb-1.5 sm:text-2xl">
                      {complaint.name}
                    </div>
                    <p className="text-sm font-semibold text-blue-600 mb-2">
                      Category: {complaint.category}
                    </p>
                    <p className="text-sm">
                      Created on {formatTimestamp1(complaint.created_at)}
                    </p>
                    <p className="mb-4 text-sm">
                      {complaint.verified_at
                        ? `Verified on ${formatTimestamp(
                            complaint.verified_at
                          )}`
                        : null}
                    </p>
                    <div
                      className="text-md leading-normal text-gray-400 sm:block overflow-hidden"
                      style={{ maxHeight: "100px" }}
                    >
                      {complaint.description}
                    </div>

                    {complaint.assigned_to ? (
                      <div className="mt-4 p-2 bg-gray-50 rounded-md border">
                        <p className="text-sm font-semibold">Assigned to:</p>
                        <p className="text-sm">
                          {complaint.assigned_to.full_name}
                        </p>
                        <p className="text-sm">
                          Phone: {complaint.assigned_to.phone}
                        </p>
                        <p className="text-sm">
                          Specialization:{" "}
                          {complaint.assigned_to.specialization}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic mt-4">
                        Not yet assigned
                      </p>
                    )}

                    {/* --- UPDATED STATUS BUTTON --- */}
                    <button
                      className={`group flex w-1/2 mt-3 cursor-default items-center justify-center rounded-md px-4 py-2 text-white transition text-sm ${getStatusClass(
                        complaint.status // This now uses the safe function
                      )}`}
                    >
                      <span className="group flex w-full items-center justify-center rounded py-1 text-center font-bold">
                        {getStatusText(complaint.status)} 
                      </span>
                    </button>
                    {/* --- END UPDATE --- */}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/3 w-full">
            <ComplaintForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Complaint;
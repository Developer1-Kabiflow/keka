"use client";

import React, { useState } from "react";
import ViewModal from "./ViewModal";
import TrackAllRequest from "./TrackAllRequests";

import TrackApprovedRequest from "./TrackApprovedByMe";
import TrackRejectedRequest from "./TrackRejectedByMe";
import TrackPendingRequest from "./TrackPendingApprovals";

const EmployeeTask = () => {
  const [activeTab, setActiveTab] = useState("All Requests");

  const renderContent = () => {
    switch (activeTab) {
      case "All Requests":
        return <TrackAllRequest />;
      case "Pending for Approval":
        return <TrackPendingRequest />;
      case "Approved by Me":
        return <TrackApprovedRequest />;
      case "Rejected by Me":
        return <TrackRejectedRequest />;
      default:
        return <div>Invalid Tab</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 p-6 bg-gray-100">
        <ul className="flex text-sm font-medium text-gray-500 border-b">
          {[
            "All Requests",
            "Pending for Approval",
            "Approved by Me",
            "Rejected by Me",
          ].map((tab) => (
            <li key={tab} className="mr-2">
              <button
                className={`p-4 rounded-t-lg ${
                  activeTab === tab
                    ? "text-blue-600 font-bold bg-white"
                    : "hover:text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
        {renderContent()}
      </div>
    </div>
  );
};

export default EmployeeTask;

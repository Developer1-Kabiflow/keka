"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

export default function ProgressStepsContainer({ approvalData }) {
  const [activeStep, setActiveStep] = useState(0);
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    if (approvalData?.approval_step) {
      setApprovals(approvalData.approval_step);
    }
  }, [approvalData]);

  const stepLength = approvals.length;

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  // Helper function to determine the color of each step
  const getStepColor = (index) => {
    const currentStep = approvals?.[index]?.current_status;
    if (currentStep === "Approved") return "green";
    if (currentStep === "Rejected") return "red";
    if (index === activeStep || index === activeStep + 1) return "primary";
    return "textSecondary";
  };

  // Helper function to determine the font weight of each step
  const getFontWeight = (index) => {
    const currentStep = approvals?.[index]?.current_status;
    return currentStep === "Approved" ||
      index === activeStep ||
      index === activeStep + 1
      ? "bold"
      : "normal";
  };

  // Get the color for the current status text
  const getCurrentStatusColor = () => {
    const currentStatus = approvals?.[activeStep]?.current_status;
    if (currentStatus === "Approved") return "green";
    if (currentStatus === "Rejected") return "red";
    return "primary";
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Current Status Heading */}
      <Typography
        variant="h6"
        color={getCurrentStatusColor()} // Dynamically apply color based on current status
        sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
      >
        {`Step ${activeStep + 1} - ${
          approvals?.[activeStep]?.current_status || "Pending"
        }`}
      </Typography>

      {/* Stepper Component */}
      <Stepper activeStep={activeStep}>
        {approvals.map((step, index) => {
          const isApproved = step?.current_status === "Approved";
          const isRejected = step?.current_status === "Rejected";
          const isNextStep =
            index === activeStep + 1 &&
            approvals?.[activeStep]?.current_status === "Approved";
          const isActive = index === activeStep;

          return (
            <Step key={index}>
              <StepLabel>
                <Typography
                  variant="body1"
                  color={getStepColor(index)} // Apply the color dynamically
                  sx={{ fontWeight: getFontWeight(index) }}
                >
                  {`Step ${index + 1}`}
                </Typography>
                {step?.approval_list?.length > 0 ? (
                  step.approval_list.map((approval, i) => (
                    <Typography
                      variant="caption"
                      color={getStepColor(index)} // Apply the color dynamically for approvers as well
                      key={i}
                    >
                      <p style={{ fontWeight: "600" }}>
                        Approvers: {approval.employee_name}
                      </p>
                    </Typography>
                  ))
                ) : (
                  <Typography variant="caption" color="textSecondary">
                    <p>No approvers available</p>
                  </Typography>
                )}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}

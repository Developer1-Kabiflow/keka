"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];

export default function ProgressStepsContainer({ approvalData }) {
  const [activeStep, setActiveStep] = useState(0);
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    // Ensure the approvalData is available before setting state
    if (approvalData && approvalData.approval_step) {
      setApprovals(approvalData.approval_step);
    }
  }, [approvalData]);

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              {label}
              {approvals?.[index]?.approval_list?.length > 0 ? (
                approvals[index].approval_list.map((approval, i) => (
                  <Typography variant="caption" color="primary" key={i}>
                    <p>Approvers: {approval.role}</p>
                  </Typography>
                ))
              ) : (
                <Typography variant="caption" color="textSecondary">
                  <p>No approvers available</p>
                </Typography>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1, textAlign: "center" }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button onClick={handleReset} variant="contained" color="primary">
              Reset
            </Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1, textAlign: "center" }}>
            {activeStep > 0 ? `Step ${activeStep + 1} is finished` : ""}
          </Typography>
        </React.Fragment>
      )}
    </Box>
  );
}

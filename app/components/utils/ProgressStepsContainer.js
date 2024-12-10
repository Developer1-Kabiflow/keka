"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import UnpublishedIcon from "@mui/icons-material/Unpublished";

export default function ProgressStepsContainer({ approvalData }) {
  const [newApprovalData, setNewApprovalData] = useState(null);

  console.log("approvalData-->", approvalData);

  const transformApprovalData = (approvalData) => {
    if (!approvalData || !approvalData.approval_step) return null;

    return {
      ...approvalData,
      approval_step: approvalData.approval_step.map((step) => ({
        step: step.step,
        step_name: `Step ${step.step}`,
        approval_list: step.approval_list.map((approval) => {
          const approverAction = step.action_by?.find(
            (action) => action.approved_by === approval.employee_id
          );

          const approvalStatus = approverAction
            ? approverAction.task_status
            : "Pending";

          const feedback =
            approvalStatus === "Rejected" && approverAction?.notes
              ? (() => {
                  try {
                    return (
                      JSON.parse(approverAction.notes)?.rejectionNote || ""
                    );
                  } catch {
                    return "";
                  }
                })()
              : "";

          return {
            employee_name: approval.employee_name,
            role: approval.role,
            approval_status: approvalStatus,
            feedback,
          };
        }),
      })),
    };
  };
  const renderSkeleton = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#E5E4E2",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "30px",
          backgroundColor: "#C4C4C4",
          borderRadius: "4px",
        }}
      />
      <Box
        sx={{
          width: "100%",
          height: "30px",
          backgroundColor: "#C4C4C4",
          borderRadius: "4px",
        }}
      />
      <Box
        sx={{
          width: "100%",
          height: "30px",
          backgroundColor: "#C4C4C4",
          borderRadius: "4px",
        }}
      />
    </Box>
  );
  useEffect(() => {
    if (approvalData) {
      const transformedData = transformApprovalData(approvalData);
      setNewApprovalData(transformedData);
      console.log("newApprovalData-->", transformedData);
    }
  }, [approvalData]);

  if (!newApprovalData || !newApprovalData.approval_step?.length) {
    return renderSkeleton();
  }

  const hasApprovals = () =>
    newApprovalData.approval_step.every((step) =>
      step.approval_list.every(
        (approval) => approval.approval_status !== "Pending"
      )
    );

  const hasRejections = () =>
    newApprovalData.approval_step.some((step) =>
      step.approval_list.some(
        (approval) => approval.approval_status === "Rejected"
      )
    );

  const getHeadingColor = (headingText) => {
    console.log(headingText);
    if (headingText === "Request Rejected") return "#D22B2B"; //red
    if (headingText === "All Steps Completed") return "#008000"; //green
    return "#899499"; //grey
  };

  const getOverallThemeColor = () => {
    if (hasRejections()) return "#FAA0A0";
    if (hasApprovals()) return "#93C572";
    return "#E5E4E2";
  };

  const renderStepIcon = ({ icon }) => {
    const stepIndex = parseInt(icon, 10) - 1;
    const step = newApprovalData.approval_step[stepIndex];

    const hasRejected = step.approval_list.some(
      (approval) => approval.approval_status === "Rejected"
    );

    if (hasRejected) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UnpublishedIcon sx={{ color: "#F44336", fontSize: "28px" }} />
        </Box>
      );
    }

    const hasApproved = step.approval_list.some(
      (approval) => approval.approval_status === "Approved"
    );

    let IconComponent = HourglassEmptyIcon;
    let color = "#B0BEC5";

    if (hasApproved) {
      IconComponent = CheckCircleIcon;
      color = "#4CAF50";
    } else if (
      step.approval_list.some(
        (approval) => approval.approval_status === "Pending"
      )
    ) {
      color = "#FF9800";
    }

    return (
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <IconComponent sx={{ color, fontSize: "28px" }} />
      </Box>
    );
  };

  const stepNameDisplay = (name) => {
    const stepNumber = parseInt(name.match(/\d+/)[0], 10);
    return stepNumber === newApprovalData.current_step ? (
      <Typography variant="body1" color="#424242" fontWeight="bold">
        Current Step
      </Typography>
    ) : (
      <Typography variant="body1" color="#424242">
        {name}
      </Typography>
    );
  };

  const stepperHeading = () => {
    const overallThemeColor = getOverallThemeColor();
    console.log("overallThemeColor-->" + overallThemeColor);
    const headingText =
      overallThemeColor === "#FAA0A0"
        ? "Request Rejected"
        : overallThemeColor === "#93C572"
        ? "All Steps Completed"
        : "Approval Process Ongoing";

    return (
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "18px",
          color: getHeadingColor(headingText),
        }}
      >
        {headingText}
      </Typography>
    );
  };

  const highlightApproverName = (approval) => {
    const isRejected = approval.approval_status === "Rejected";
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: isRejected ? "#FFEBEE" : "transparent",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor:
              approval.approval_status === "Approved"
                ? "#4CAF50"
                : approval.approval_status === "Rejected"
                ? "#F44336"
                : "#B0BEC5",
            flexShrink: 0,
          }}
        />
        <Typography
          variant="body1"
          color={isRejected ? "#F44336" : "#424242"}
          sx={{
            textTransform: "capitalize",
            fontWeight:
              approval.approval_status === "Approved" ? "bold" : "normal",
            flexGrow: 1,
          }}
        >
          {approval.employee_name} ({approval.role})
        </Typography>
        {isRejected && (
          <Typography
            variant="body2"
            color="#F44336"
            sx={{ marginLeft: "16px", fontStyle: "italic" }}
          >
            Feedback: {approval.feedback}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: getOverallThemeColor(),
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.5s ease",
      }}
    >
      {newApprovalData.approval_step.length === 0 ? (
        renderSkeleton()
      ) : (
        <>
          {stepperHeading()}
          <Stepper
            activeStep={
              hasApprovals()
                ? newApprovalData.approval_step.length
                : newApprovalData.current_step - 1
            }
            alternativeLabel
            sx={{ paddingBottom: "10px" }}
          >
            {newApprovalData.approval_step.map((step, index) => (
              <Step key={index} completed={hasApprovals()}>
                <StepLabel StepIconComponent={renderStepIcon}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {stepNameDisplay(step.step_name)}
                  </Box>
                </StepLabel>
                <br />
                <Box
                  sx={{
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    padding: "10px",
                    width: "100%",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {step.approval_list.map((approval, i) => (
                    <Box key={i} sx={{ mt: 1 }}>
                      {highlightApproverName(approval)}
                    </Box>
                  ))}
                </Box>
              </Step>
            ))}
          </Stepper>
        </>
      )}
    </Box>
  );
}

// 'use client'; directive ensures this component is client-side
'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

export default function ProgressStepsContainer({ approvalData }) {
  const [activeStep, setActiveStep] = useState(0);
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    // Ensure the approvalData is available before setting state
    if (approvalData && approvalData.approval_step) {
      setApprovals(approvalData.approval_step);
    }
  }, [approvalData]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              {label}
              {approvals?.[index]?.approval_list?.length > 0 ? (
                approvals[index].approval_list.map((approval, i) => (
                  <Typography variant="caption" color="primary" key={i}>
                    <p>Approvers: {approval.employee_id}</p>
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
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              {/* Back */}
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {/* {activeStep === steps.length - 1 ? 'Finish' : 'Next'} */}
            </Button>
          </Box>
          <Typography sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
            {activeStep > 0 ? `Step ${activeStep + 1} is finished` : ''}
          </Typography>
        </React.Fragment>
      )}
    </Box>
  );
}

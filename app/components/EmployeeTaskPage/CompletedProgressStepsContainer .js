"use client";

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

export default function CompletedProgressStepsContainer () {
  const [activeStep, setActiveStep] = useState(0);
  const employee = [
    { name: 'Employee 1' },
    { name: 'Employee 2' },
    { name: 'Employee 3' },
    { name: 'Employee 4' }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={index <= activeStep}>
            <StepLabel>
              {label} 
              {index < 3 && (
                <Typography variant="caption" color="primary">
                  <p>Approved</p>
                  <p>{employee[index]?.name || 'N/A'}</p>
                </Typography>
              )}
            </StepLabel>

            {index === steps.length - 1 && (
              <Typography variant="caption" color="primary">
                <p className="ml-[65px]">Completed</p>
                <p className="ml-[65px]">{employee[index]?.name || 'N/A'}</p>
              </Typography>
            )}
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
            {activeStep > 0 ? `Step ${activeStep} is finished` : ''}
          </Typography>
        </React.Fragment>
      )}
    </Box>
  );
}

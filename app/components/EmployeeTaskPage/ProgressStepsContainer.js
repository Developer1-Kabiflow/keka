"use client";

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

export default function ProgressStepsContainer() {
  const [activeStep, setActiveStep] = useState(0);
  const employee = [{ name: 'Employee 1' }, { name: 'Employee 2' }];

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
      <Stepper activeStep={activeStep + 2}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              {label} {index < 2 && (
                <Typography variant="caption" color="primary">
                  <p>Approved</p>
                  <p>{employee[index]?.name}</p>
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

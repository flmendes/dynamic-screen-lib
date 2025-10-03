// ==================== COMPONENTE: StepWizard ====================
// src/components/StepWizard.tsx
import React from 'react';
import { Step } from '../types/schema.types';

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const StepWizard: React.FC<StepWizardProps> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = onStepClick && (isCompleted || isActive);

          return (
            <React.Fragment key={step.id}>
              <div 
                className={`
                  flex flex-col items-center flex-1
                  ${isClickable ? 'cursor-pointer' : ''}
                `}
                onClick={() => isClickable && onStepClick(index)}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-semibold text-sm transition-all duration-200
                  ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                  ${isCompleted ? 'bg-green-600 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                `}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`
                    text-sm font-medium
                    ${isActive ? 'text-blue-600' : ''}
                    ${isCompleted ? 'text-green-600' : ''}
                    ${!isActive && !isCompleted ? 'text-gray-500' : ''}
                  `}>
                    {step.title}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className={`
                  h-1 flex-1 mx-4 rounded transition-all duration-200
                  ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {steps[currentStep]?.description && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {steps[currentStep].description}
          </p>
        </div>
      )}
    </div>
  );
};

export default StepWizard;
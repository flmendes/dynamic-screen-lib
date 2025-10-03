// ==================== COMPONENTE: DynamicScreenRenderer ====================
// src/components/DynamicScreenRenderer.tsx

import React from 'react';
import { useDynamicScreen, UseDynamicScreenOptions } from '../hooks/useDynamicScreen';
import { useFormValidation } from '../hooks/useFormValidation';
import StepWizard from './StepWizard';
import FormSection from './FormSection';
import { Button } from '../types/schema.types';

interface DynamicScreenRendererProps extends UseDynamicScreenOptions {
  renderLoading?: () => React.ReactNode;
  renderError?: (error: Error) => React.ReactNode;
  renderSuccess?: (data: any) => React.ReactNode;
  onButtonClick?: (action: string, customAction?: string) => void;
}

const DynamicScreenRenderer: React.FC<DynamicScreenRendererProps> = ({
  screenId,
  apiBaseUrl,
  onSuccess,
  onError,
  customFetch,
  renderLoading,
  renderError,
  renderSuccess,
  onButtonClick
}) => {
  const {
    loading,
    error,
    schema,
    currentStep,
    currentStepData,
    isFirstStep,
    isLastStep,
    nextStep,
    previousStep,
    submitForm
  } = useDynamicScreen({
    screenId,
    apiBaseUrl,
    onSuccess,
    onError,
    customFetch
  });

  const allFields = React.useMemo(() =>
    currentStepData?.sections.flatMap((s: any) => s.fields) || [],
    [currentStepData]
  );

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isSubmitting,
    setIsSubmitting
  } = useFormValidation(allFields);

  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [submitData, setSubmitData] = React.useState<any>(null);

  const handleButtonAction = async (button: Button) => {
    if (onButtonClick) {
      onButtonClick(button.action, button.customAction);
      return;
    }

    switch (button.action) {
      case 'next':
        if (validateAll()) {
          nextStep();
        }
        break;

      case 'previous':
        previousStep();
        break;

      case 'submit':
        if (validateAll()) {
          setIsSubmitting(true);
          try {
            const result = await submitForm(values);
            setSubmitData(result);
            setSubmitStatus('success');
          } catch (err) {
            setSubmitStatus('error');
          } finally {
            setIsSubmitting(false);
          }
        }
        break;

      case 'cancel':
        window.history.back();
        break;
    }
  };

  const getButtonVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500';
      case 'secondary':
      default:
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500';
    }
  };

  // Loading state
  if (loading) {
    if (renderLoading) {
      return <>{renderLoading()}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    if (renderError) {
      return <>{renderError(error)}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
            Erro ao carregar
          </h2>
          <p className="text-gray-600 text-center">{error.message}</p>
        </div>
      </div>
    );
  }

  // Success state
  if (submitStatus === 'success') {
    if (renderSuccess) {
      return <>{renderSuccess(submitData)}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Enviado com sucesso!
          </h2>
          <p className="text-gray-600">
            Seus dados foram processados com sucesso.
          </p>
        </div>
      </div>
    );
  }

  if (!schema || !currentStepData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{schema.title}</h1>
            {schema.description && (
              <p className="text-blue-100">{schema.description}</p>
            )}
          </div>

          <div className="px-8 py-8">
            {/* Wizard para múltiplos steps */}
            {schema.type === 'wizard' && schema.steps.length > 1 && (
              <StepWizard
                steps={schema.steps}
                currentStep={currentStep}
              />
            )}

            {/* Current Step Content */}
            <div className="mb-8">
              {currentStepData.sections.map((section: any) => (
                <FormSection
                  key={section.id}
                  section={section}
                  values={values}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end border-t pt-6">
              {currentStepData.buttons.map((button: any) => (
                <button
                  key={button.id}
                  type={button.type}
                  onClick={() => handleButtonAction(button)}
                  disabled={button.disabled || isSubmitting}
                  className={`
                    px-6 py-3 rounded-lg font-medium
                    transition-all duration-200
                    focus:outline-hidden focus:ring-2 focus:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${getButtonVariantClasses(button.variant)}
                  `}
                >
                  {isSubmitting && button.action === 'submit' ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Enviando...
                    </span>
                  ) : (
                    button.label
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicScreenRenderer;
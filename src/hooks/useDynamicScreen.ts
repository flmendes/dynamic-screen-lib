// ==================== HOOKS ====================
// src/hooks/useDynamicScreen.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { ScreenSchema, FormValues } from '../types/schema.types';

export interface UseDynamicScreenOptions {
  screenId: string;
  apiBaseUrl?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  customFetch?: (screenId: string) => Promise<ScreenSchema>;
}

export const useDynamicScreen = ({
  screenId,
  apiBaseUrl = '/api',
  onSuccess,
  onError,
  customFetch
}: UseDynamicScreenOptions) => {
  const [loading, setLoading] = useState(true);
  const [schema, setSchema] = useState<ScreenSchema | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Use refs to store callbacks to avoid triggering useEffect
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  // Carrega o schema
  const loadSchema = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data: ScreenSchema;

      if (customFetch) {
        data = await customFetch(screenId);
      } else {
        const response = await fetch(`${apiBaseUrl}/screens/${screenId}`);
        if (!response.ok) {
          throw new Error(`Failed to load screen: ${response.statusText}`);
        }
        const result = await response.json();

        // Handle wrapped API response (e.g., { success: true, data: {...} })
        data = result.data || result;
      }

      setSchema(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onErrorRef.current?.(error);
    } finally {
      setLoading(false);
    }
  }, [screenId, apiBaseUrl, customFetch]);

  useEffect(() => {
    loadSchema();
  }, [loadSchema]);

  // Navega para o próximo step
  const nextStep = useCallback(() => {
    setCurrentStep(prev => 
      Math.min(prev + 1, (schema?.steps.length || 1) - 1)
    );
  }, [schema]);

  // Navega para o step anterior
  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Vai para um step específico
  const goToStep = useCallback((step: number) => {
    if (schema && step >= 0 && step < schema.steps.length) {
      setCurrentStep(step);
    }
  }, [schema]);

  // Submete os dados
  const submitForm = useCallback(async (values: FormValues) => {
    if (!schema?.onSubmit) {
      throw new Error('No submit configuration found');
    }

    try {
      const response = await fetch(schema.onSubmit.endpoint, {
        method: schema.onSubmit.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...schema.onSubmit.headers
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error(`Submit failed: ${response.statusText}`);
      }

      const data = await response.json();
      onSuccessRef.current?.(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Submit failed');
      onErrorRef.current?.(error);
      throw error;
    }
  }, [schema]);

  return {
    loading,
    error,
    schema,
    currentStep,
    currentStepData: schema?.steps[currentStep],
    totalSteps: schema?.steps.length || 0,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === (schema?.steps.length || 0) - 1,
    nextStep,
    previousStep,
    goToStep,
    submitForm,
    reload: loadSchema
  };
};

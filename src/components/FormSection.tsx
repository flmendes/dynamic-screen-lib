// ==================== COMPONENTE: FormSection ====================
// src/components/FormSection.tsx

import React, { useState } from 'react';
import { Section, FormValues, FormErrors, FormTouched } from '../types/schema.types';
import { getVisibleFields } from '../utils/fieldVisibility';
import DynamicField from './DynamicField';

interface FormSectionProps {
  section: Section;
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  onChange: (name: string, value: any, field: any) => void;
  onBlur: (name: string, field: any) => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  values,
  errors,
  touched,
  onChange,
  onBlur
}) => {
  const [isCollapsed, setIsCollapsed] = useState(section.defaultCollapsed || false);
  const visibleFields = getVisibleFields(section.fields, values);

  if (!section.visible && section.visible !== undefined) {
    return null;
  }

  return (
    <div className="mb-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {section.title && (
        <div 
          className={`
            px-6 py-4 bg-gray-50 border-b border-gray-200
            ${section.collapsible ? 'cursor-pointer hover:bg-gray-100' : ''}
          `}
          onClick={() => section.collapsible && setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {section.title}
              </h3>
              {section.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {section.description}
                </p>
              )}
            </div>
            {section.collapsible && (
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </div>
        </div>
      )}

      {(!section.collapsible || !isCollapsed) && (
        <div className="px-6 py-6">
          {visibleFields.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Nenhum campo disponível nesta seção
            </p>
          ) : (
            <div className="space-y-1">
              {visibleFields.map(field => (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={values[field.name]}
                  error={errors[field.name]}
                  touched={touched[field.name]}
                  onChange={(value) => onChange(field.name, value, field)}
                  onBlur={() => onBlur(field.name, field)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormSection;
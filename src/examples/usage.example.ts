// ==================== EXEMPLO DE USO ====================
// src/examples/usage.example.ts

/*
// 1. Instalar a biblioteca
npm install @flmendes/dynamic-screen-lib

// 2. Configurar o cliente
import { DynamicScreenClient } from '@flmendes/dynamic-screen-lib';

const client = new DynamicScreenClient('https://api.example.com');
client.setAuthToken('seu-token-jwt');

// 3. Usar o hook
import { useDynamicScreen, useFormValidation } from '@flmendes/dynamic-screen-lib';

function MyForm() {
  const {
    loading,
    schema,
    currentStepData,
    nextStep,
    previousStep,
    submitForm
  } = useDynamicScreen({
    screenId: 'user-registration',
    apiBaseUrl: 'https://api.example.com',
    onSuccess: (data) => console.log('Success!', data),
    onError: (error) => console.error('Error:', error)
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll
  } = useFormValidation(currentStepData?.sections.flatMap(s => s.fields) || []);

  const handleNext = () => {
    if (validateAll()) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (validateAll()) {
      await submitForm(values);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {currentStepData?.sections.map(section => (
        <div key={section.id}>
          <h2>{section.title}</h2>
          {section.fields.map(field => (
            <input
              key={field.id}
              type={field.type}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value, field)}
              onBlur={() => handleBlur(field.name, field)}
            />
          ))}
        </div>
      ))}
      <button onClick={previousStep}>Voltar</button>
      <button onClick={handleNext}>Próximo</button>
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  );
}
*/
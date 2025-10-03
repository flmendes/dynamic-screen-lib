// tests/userRegistrationForm.test.ts

import { ScreenSchema } from '../src/types/schema.types';

describe('User Registration Form Schema', () => {
  const userRegistrationSchema: ScreenSchema = {
    screenId: "user-registration",
    version: "1.0.0",
    title: "Cadastro de Usuário",
    description: "Complete seu cadastro para acessar o sistema",
    type: "wizard",
    metadata: {
      createdAt: "2025-01-15T10:00:00Z",
      author: "Sistema BFF"
    },
    steps: [
      {
        id: "personal-data",
        title: "Dados Pessoais",
        description: "Informações básicas sobre você",
        sections: [
          {
            id: "basic-info",
            title: "Informações Básicas",
            fields: [
              {
                id: "fullName",
                name: "fullName",
                label: "Nome Completo",
                type: "text",
                placeholder: "Digite seu nome completo",
                validations: [
                  {
                    type: "required",
                    message: "Nome é obrigatório"
                  },
                  {
                    type: "min",
                    value: 3,
                    message: "Nome deve ter no mínimo 3 caracteres"
                  }
                ],
                helpText: "Digite seu nome como consta nos documentos"
              },
              {
                id: "email",
                name: "email",
                label: "E-mail",
                type: "email",
                placeholder: "seu@email.com",
                validations: [
                  {
                    type: "required",
                    message: "E-mail é obrigatório"
                  },
                  {
                    type: "email",
                    message: "E-mail inválido"
                  }
                ]
              },
              {
                id: "birthdate",
                name: "birthdate",
                label: "Data de Nascimento",
                type: "date",
                validations: [
                  {
                    type: "required",
                    message: "Data de nascimento é obrigatória"
                  }
                ]
              },
              {
                id: "phone",
                name: "phone",
                label: "Telefone",
                type: "text",
                placeholder: "(00) 00000-0000",
                validations: [
                  {
                    type: "required",
                    message: "Telefone é obrigatório"
                  }
                ]
              }
            ]
          }
        ],
        buttons: [
          {
            id: "next-step-1",
            label: "Próximo",
            type: "submit",
            action: "next",
            variant: "primary"
          }
        ]
      },
      {
        id: "address",
        title: "Endereço",
        description: "Onde você mora?",
        sections: [
          {
            id: "address-info",
            title: "Dados de Endereço",
            fields: [
              {
                id: "street",
                name: "street",
                label: "Rua",
                type: "text",
                validations: [
                  {
                    type: "required",
                    message: "Rua é obrigatória"
                  }
                ]
              },
              {
                id: "number",
                name: "number",
                label: "Número",
                type: "text",
                validations: [
                  {
                    type: "required",
                    message: "Número é obrigatório"
                  }
                ]
              },
              {
                id: "city",
                name: "city",
                label: "Cidade",
                type: "text",
                validations: [
                  {
                    type: "required",
                    message: "Cidade é obrigatória"
                  }
                ]
              },
              {
                id: "state",
                name: "state",
                label: "Estado",
                type: "select",
                options: [
                  {
                    label: "São Paulo",
                    value: "SP"
                  },
                  {
                    label: "Rio de Janeiro",
                    value: "RJ"
                  },
                  {
                    label: "Minas Gerais",
                    value: "MG"
                  },
                  {
                    label: "Distrito Federal",
                    value: "DF"
                  }
                ],
                validations: [
                  {
                    type: "required",
                    message: "Estado é obrigatório"
                  }
                ]
              }
            ]
          }
        ],
        buttons: [
          {
            id: "prev-step-2",
            label: "Voltar",
            type: "button",
            action: "previous",
            variant: "secondary"
          },
          {
            id: "next-step-2",
            label: "Próximo",
            type: "submit",
            action: "next",
            variant: "primary"
          }
        ]
      },
      {
        id: "account-settings",
        title: "Confirmação",
        sections: [
          {
            id: "terms",
            title: "Termos e Condições",
            fields: [
              {
                id: "newsletter",
                name: "newsletter",
                label: "Desejo receber newsletters e novidades",
                type: "checkbox"
              },
              {
                id: "acceptTerms",
                name: "acceptTerms",
                label: "Li e aceito os termos de uso e política de privacidade",
                type: "checkbox",
                validations: [
                  {
                    type: "required",
                    message: "Você deve aceitar os termos para continuar"
                  }
                ]
              }
            ]
          }
        ],
        buttons: [
          {
            id: "prev-step-3",
            label: "Voltar",
            type: "button",
            action: "previous",
            variant: "secondary"
          },
          {
            id: "submit-form",
            label: "Finalizar Cadastro",
            type: "submit",
            action: "submit",
            variant: "primary"
          }
        ]
      }
    ],
    onSubmit: {
      endpoint: "/api/users/register",
      method: "POST"
    }
  };

  describe('Schema Structure', () => {
    test('should have correct screen metadata', () => {
      expect(userRegistrationSchema.screenId).toBe('user-registration');
      expect(userRegistrationSchema.version).toBe('1.0.0');
      expect(userRegistrationSchema.title).toBe('Cadastro de Usuário');
      expect(userRegistrationSchema.type).toBe('wizard');
    });

    test('should have metadata with author and creation date', () => {
      expect(userRegistrationSchema.metadata).toBeDefined();
      expect(userRegistrationSchema.metadata?.author).toBe('Sistema BFF');
      expect(userRegistrationSchema.metadata?.createdAt).toBe('2025-01-15T10:00:00Z');
    });

    test('should have correct submit configuration', () => {
      expect(userRegistrationSchema.onSubmit?.endpoint).toBe('/api/users/register');
      expect(userRegistrationSchema.onSubmit?.method).toBe('POST');
    });
  });

  describe('Wizard Steps', () => {
    test('should have exactly 3 steps', () => {
      expect(userRegistrationSchema.steps).toHaveLength(3);
    });

    test('should have correct step order and IDs', () => {
      expect(userRegistrationSchema.steps[0].id).toBe('personal-data');
      expect(userRegistrationSchema.steps[1].id).toBe('address');
      expect(userRegistrationSchema.steps[2].id).toBe('account-settings');
    });

    test('should have titles and descriptions for each step', () => {
      expect(userRegistrationSchema.steps[0].title).toBe('Dados Pessoais');
      expect(userRegistrationSchema.steps[0].description).toBe('Informações básicas sobre você');
      expect(userRegistrationSchema.steps[1].title).toBe('Endereço');
      expect(userRegistrationSchema.steps[2].title).toBe('Confirmação');
    });
  });

  describe('Step 1: Personal Data', () => {
    const personalDataStep = userRegistrationSchema.steps[0];

    test('should have one section with basic info', () => {
      expect(personalDataStep.sections).toHaveLength(1);
      expect(personalDataStep.sections[0].id).toBe('basic-info');
      expect(personalDataStep.sections[0].title).toBe('Informações Básicas');
    });

    test('should have 4 required fields', () => {
      const fields = personalDataStep.sections[0].fields;
      expect(fields).toHaveLength(4);

      const fieldIds = fields.map(f => f.id);
      expect(fieldIds).toEqual(['fullName', 'email', 'birthdate', 'phone']);
    });

    test('fullName field should have correct validations', () => {
      const fullNameField = personalDataStep.sections[0].fields[0];

      expect(fullNameField.type).toBe('text');
      expect(fullNameField.validations).toHaveLength(2);
      expect(fullNameField.validations?.[0].type).toBe('required');
      expect(fullNameField.validations?.[1].type).toBe('min');
      expect(fullNameField.validations?.[1].value).toBe(3);
      expect(fullNameField.helpText).toBe('Digite seu nome como consta nos documentos');
    });

    test('email field should have email validation', () => {
      const emailField = personalDataStep.sections[0].fields[1];

      expect(emailField.type).toBe('email');
      expect(emailField.placeholder).toBe('seu@email.com');
      expect(emailField.validations).toHaveLength(2);
      expect(emailField.validations?.[0].type).toBe('required');
      expect(emailField.validations?.[1].type).toBe('email');
    });

    test('should have next button', () => {
      expect(personalDataStep.buttons).toHaveLength(1);
      expect(personalDataStep.buttons[0].action).toBe('next');
      expect(personalDataStep.buttons[0].type).toBe('submit');
      expect(personalDataStep.buttons[0].variant).toBe('primary');
    });
  });

  describe('Step 2: Address', () => {
    const addressStep = userRegistrationSchema.steps[1];

    test('should have address info section', () => {
      expect(addressStep.sections).toHaveLength(1);
      expect(addressStep.sections[0].id).toBe('address-info');
      expect(addressStep.sections[0].title).toBe('Dados de Endereço');
    });

    test('should have 4 address fields', () => {
      const fields = addressStep.sections[0].fields;
      expect(fields).toHaveLength(4);

      const fieldIds = fields.map(f => f.id);
      expect(fieldIds).toEqual(['street', 'number', 'city', 'state']);
    });

    test('state field should be a select with 4 options', () => {
      const stateField = addressStep.sections[0].fields[3];

      expect(stateField.type).toBe('select');
      expect(stateField.options).toHaveLength(4);

      const optionValues = stateField.options?.map(o => o.value);
      expect(optionValues).toEqual(['SP', 'RJ', 'MG', 'DF']);
    });

    test('all address fields should be required', () => {
      const fields = addressStep.sections[0].fields;

      fields.forEach(field => {
        expect(field.validations).toBeDefined();
        expect(field.validations?.[0].type).toBe('required');
      });
    });

    test('should have previous and next buttons', () => {
      expect(addressStep.buttons).toHaveLength(2);
      expect(addressStep.buttons[0].action).toBe('previous');
      expect(addressStep.buttons[0].variant).toBe('secondary');
      expect(addressStep.buttons[1].action).toBe('next');
      expect(addressStep.buttons[1].variant).toBe('primary');
    });
  });

  describe('Step 3: Confirmation', () => {
    const confirmationStep = userRegistrationSchema.steps[2];

    test('should have terms section', () => {
      expect(confirmationStep.sections).toHaveLength(1);
      expect(confirmationStep.sections[0].id).toBe('terms');
      expect(confirmationStep.sections[0].title).toBe('Termos e Condições');
    });

    test('should have 2 checkbox fields', () => {
      const fields = confirmationStep.sections[0].fields;
      expect(fields).toHaveLength(2);

      expect(fields[0].type).toBe('checkbox');
      expect(fields[1].type).toBe('checkbox');
    });

    test('newsletter checkbox should be optional', () => {
      const newsletterField = confirmationStep.sections[0].fields[0];

      expect(newsletterField.id).toBe('newsletter');
      expect(newsletterField.validations).toBeUndefined();
    });

    test('acceptTerms checkbox should be required', () => {
      const acceptTermsField = confirmationStep.sections[0].fields[1];

      expect(acceptTermsField.id).toBe('acceptTerms');
      expect(acceptTermsField.validations).toHaveLength(1);
      expect(acceptTermsField.validations?.[0].type).toBe('required');
      expect(acceptTermsField.validations?.[0].message).toBe('Você deve aceitar os termos para continuar');
    });

    test('should have previous and submit buttons', () => {
      expect(confirmationStep.buttons).toHaveLength(2);
      expect(confirmationStep.buttons[0].action).toBe('previous');
      expect(confirmationStep.buttons[1].action).toBe('submit');
      expect(confirmationStep.buttons[1].label).toBe('Finalizar Cadastro');
    });
  });

  describe('Field Count', () => {
    test('should have total of 10 fields across all steps', () => {
      const totalFields = userRegistrationSchema.steps.reduce((sum, step) => {
        return sum + step.sections.reduce((sectionSum, section) => {
          return sectionSum + section.fields.length;
        }, 0);
      }, 0);

      expect(totalFields).toBe(10);
    });

    test('should have 9 required fields', () => {
      let requiredCount = 0;

      userRegistrationSchema.steps.forEach(step => {
        step.sections.forEach(section => {
          section.fields.forEach(field => {
            const hasRequired = field.validations?.some(v => v.type === 'required');
            if (hasRequired) requiredCount++;
          });
        });
      });

      expect(requiredCount).toBe(9);
    });
  });

  describe('API Response Structure', () => {
    test('should match expected API response format', () => {
      const apiResponse = {
        success: true,
        data: userRegistrationSchema
      };

      expect(apiResponse.success).toBe(true);
      expect(apiResponse.data).toEqual(userRegistrationSchema);
    });
  });
});

interface PasswordRule {
  key: string;
  label: string;
  isValid: boolean;
};

export const getPasswordRules = (
  password: string,
): PasswordRule[] => {
  return [
    {
      key: "uppercase",
      label: "Deve conter pelo menos uma letra maiúscula",
      isValid: /[A-Z]/.test(password),
    },
    {
      key: "lowercase",
      label: "Deve conter pelo menos uma letra minúscula",
      isValid: /[a-z]/.test(password),
    },
    {
      key: "special",
      label: "Deve conter pelo menos um caractere especial",
      isValid: /[^a-zA-Z0-9]/.test(password),
    },
    {
      key: "min",
      label: "Deve ter pelo menos 8 caracteres",
      isValid: password?.length >= 8,
    },
  ];
};

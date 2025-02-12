export const signUpRedirect = () => {
  const clientId = "2qc9uch823amu97rhd8r1tcvpa";
  const signUpUri = import.meta.env.VITE_REDIRECT_URI;
  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
  window.location.href = `${cognitoDomain}/signup?client_id=${clientId}&code_challenge=OQSY9NXNOZrGZUUPsfnuvLMiY5M4Bx0yQ-DMqHbycvE&code_challenge_method=S256&redirect_uri=${encodeURIComponent(
    signUpUri
  )}&response_type=code&scope=openid+email`;
};

export const getSessionInfo = () => {
  return sessionStorage.getItem(
    "oidc.user:https://cognito-idp.us-east-1.amazonaws.com/us-east-1_883WzBpGQ:2qc9uch823amu97rhd8r1tcvpa"
  );
};

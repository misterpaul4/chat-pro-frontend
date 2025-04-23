export const paths = {
  login: "/auth/login",
  signup: "/auth/signup",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verificationCode: "/auth/verification",
  home: "/",
};

export const isAuthPath = (path: string) => {
  return [paths.login, paths.signup, paths.forgotPassword, paths.resetPassword, paths.verificationCode].some(authPath =>
    path.startsWith(authPath)
  );
};

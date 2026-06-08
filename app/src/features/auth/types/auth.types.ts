export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
};

export type RegisterResponse = {
  user: AuthUser | null;
  hasSession: boolean;
  message: string;
};

export type LoginResponse = {
  user: AuthUser;
  hasSession: boolean;
};

export type ForgotPasswordCredentials = {
  email: string;
};

export type UpdatePasswordCredentials = {
  password: string;
};

export type AuthMessageResponse = {
  message: string;
};

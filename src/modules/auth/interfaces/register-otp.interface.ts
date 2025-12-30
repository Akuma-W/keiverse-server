export interface RegisterOtp {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  phone?: string;
  school?: string;
  roleId?: number;
  otp: string;
}

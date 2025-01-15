// Define constants for user roles
export const USER_ROLE = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
  SALESMAN: "salesman",
  USER: "user",
} as const;

// Define the UserRole type based on USER_ROLE constants
export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type Role = "ADMIN" | "ANALYST" | "VIEWER";

export const PERMISSIONS = {
  ADMIN: {
    canManageMembers: true,
    canChangeRoles: true,
    canAddFeedback: true,
    canUpdateFeedback: true,
    canViewAnalytics: true,
  },
  ANALYST: {
    canManageMembers: false,
    canChangeRoles: false,
    canAddFeedback: true,
    canUpdateFeedback: true,
    canViewAnalytics: true,
  },
  VIEWER: {
    canManageMembers: false,
    canChangeRoles: false,
    canAddFeedback: false,
    canUpdateFeedback: false,
    canViewAnalytics: false,
  },
} as const;

export function hasPermission(role: Role, permission: keyof typeof PERMISSIONS.ADMIN): boolean {
  return PERMISSIONS[role]?.[permission] ?? false;
}
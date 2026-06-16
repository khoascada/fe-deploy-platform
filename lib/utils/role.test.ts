import { describe, it, expect } from 'vitest';
import { hasRole, isAdmin, isTeacher, isStudent, ROLES } from './role';

describe('role.ts logic', () => {
  const mockRoles = JSON.stringify([{ role_name: ROLES.ADMIN }, { role_name: ROLES.STUDENT }]);

  describe('hasRole()', () => {
    it('returns true when the role exists', () => {
      expect(hasRole(mockRoles, ROLES.ADMIN)).toBe(true);
      expect(hasRole(mockRoles, ROLES.STUDENT)).toBe(true);
    });

    it('returns false when the role does not exist', () => {
      expect(hasRole(mockRoles, ROLES.TEACHER)).toBe(false);
    });

    it('returns false when input is empty', () => {
      expect(hasRole(undefined, ROLES.ADMIN)).toBe(false);
      expect(hasRole('', ROLES.ADMIN)).toBe(false);
    });

    it('returns false for invalid JSON', () => {
      expect(hasRole('invalid-json', ROLES.ADMIN)).toBe(false);
    });
  });

  describe('role helpers', () => {
    it('isAdmin works', () => {
      expect(isAdmin(mockRoles)).toBe(true);
    });

    it('isTeacher works', () => {
      expect(isTeacher(mockRoles)).toBe(false);
    });

    it('isStudent works', () => {
      expect(isStudent(mockRoles)).toBe(true);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestCtx } from './convex/test-utils';

describe('Module Guard Tests', () => {
  let mockCtx: any;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
      get: vi.fn(),
      insert: vi.fn(),
      patch: vi.fn(),
      replace: vi.fn(),
      delete: vi.fn(),
    };

    mockCtx = createTestCtx();
    mockCtx.db = mockDb;
    mockCtx.auth = {
      getUserId: vi.fn().mockResolvedValue('test-user-id'),
      getTokenIdentifier: vi.fn().mockResolvedValue('test@example.com'),
    };
  });

  describe('Module Installation Validation', () => {
    it('should allow access when module is installed and active', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'academics';

      const installedModule = {
        _id: 'module-id',
        tenantId,
        moduleId,
        status: 'active',
        installedAt: Date.now(),
        installedBy: 'admin-user',
        config: {},
      };

      const tenant = {
        tenantId,
        name: 'Test School',
        plan: 'standard',
        status: 'active',
      };

      const organization = {
        tenantId,
        tier: 'standard',
        isActive: true,
      };

      mockDb.query.mockImplementation((table: string) => {
        if (table === 'installedModules') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  first: vi.fn().mockResolvedValue(installedModule),
                }),
              }),
            }),
          };
        }
        if (table === 'tenants') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                first: vi.fn().mockResolvedValue(tenant),
              }),
            }),
          };
        }
        if (table === 'organizations') {
          return {
            withIndex: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(organization),
            }),
          };
        }
        return {
          withIndex: vi.fn(),
        };
      });

      const { requireModule } = await import("../../../../convex/helpers/moduleGuard");
      
      await expect(requireModule(mockCtx, tenantId, moduleId)).resolves.not.toThrow();
    });

    it('should deny access when module is not installed', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'library';

      const tenant = {
        tenantId,
        name: 'Test School',
        plan: 'standard',
        status: 'active',
      };

      const organization = {
        tenantId,
        tier: 'standard',
        isActive: true,
      };

      mockDb.query.mockImplementation((table: string) => {
        if (table === 'installedModules') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  first: vi.fn().mockResolvedValue(null),
                }),
              }),
            }),
          };
        }
        if (table === 'tenants') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                first: vi.fn().mockResolvedValue(tenant),
              }),
            }),
          };
        }
        if (table === 'organizations') {
          return {
            withIndex: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(organization),
            }),
          };
        }
        return {
          withIndex: vi.fn(),
        };
      });

      const { requireModule } = await import("../../../../convex/helpers/moduleGuard");

      await expect(requireModule(mockCtx, tenantId, moduleId)).rejects.toThrow('MODULE_NOT_INSTALLED');
    });

    it('should deny access when module is inactive', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'transport';

      const inactiveModule = {
        _id: 'module-id',
        tenantId,
        moduleId,
        status: 'inactive',
        installedAt: Date.now(),
        installedBy: 'admin-user',
        config: {},
      };

      const tenant = {
        tenantId,
        name: 'Test School',
        plan: 'standard',
        status: 'active',
      };

      const organization = {
        tenantId,
        tier: 'standard',
        isActive: true,
      };

      mockDb.query.mockImplementation((table: string) => {
        if (table === 'installedModules') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  first: vi.fn().mockResolvedValue(inactiveModule),
                }),
              }),
            }),
          };
        }
        if (table === 'tenants') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                first: vi.fn().mockResolvedValue(tenant),
              }),
            }),
          };
        }
        if (table === 'organizations') {
          return {
            withIndex: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(organization),
            }),
          };
        }
        return {
          withIndex: vi.fn(),
        };
      });

      const { requireModule } = await import("../../../../convex/helpers/moduleGuard");

      await expect(requireModule(mockCtx, tenantId, moduleId)).rejects.toThrow('MODULE_INACTIVE');
    });
  });

  describe('Module Tier Validation', () => {
    it('should allow access to modules within tenant tier', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'academics';

      const tenant = {
        tenantId,
        name: 'Test School',
        plan: 'standard',
        status: 'active',
      };

      const organization = {
        tenantId,
        tier: 'standard',
        isActive: true,
      };

      const installedModule = {
        _id: 'module-id',
        tenantId,
        moduleId,
        status: 'active',
        installedAt: Date.now(),
      };

      mockDb.query.mockImplementation((table: string) => {
        if (table === 'tenants') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                first: vi.fn().mockResolvedValue(tenant),
              }),
            }),
          };
        }
        if (table === 'organizations') {
          return {
            withIndex: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(organization),
            }),
          };
        }
        if (table === 'installedModules') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  first: vi.fn().mockResolvedValue(installedModule),
                }),
              }),
            }),
          };
        }
        return {
          withIndex: vi.fn(),
        };
      });

      const { requireModule } = await import("../../../../convex/helpers/moduleGuard");

      await expect(requireModule(mockCtx, tenantId, moduleId)).resolves.not.toThrow();
    });

    it('should deny access to modules outside tenant tier', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'advanced_analytics';

      const tenant = {
        tenantId,
        name: 'Test School',
        plan: 'starter',
        status: 'active',
      };

      const organization = {
        tenantId,
        tier: 'starter',
        isActive: true,
      };

      const installedModule = {
        _id: 'module-id',
        tenantId,
        moduleId,
        status: 'active',
        installedAt: Date.now(),
      };

      mockDb.query.mockImplementation((table: string) => {
        if (table === 'tenants') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                first: vi.fn().mockResolvedValue(tenant),
              }),
            }),
          };
        }
        if (table === 'organizations') {
          return {
            withIndex: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(organization),
            }),
          };
        }
        if (table === 'installedModules') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  first: vi.fn().mockResolvedValue(installedModule),
                }),
              }),
            }),
          };
        }
        return {
          withIndex: vi.fn(),
        };
      });

      const { requireModule } = await import("../../../../convex/helpers/moduleGuard");

      await expect(requireModule(mockCtx, tenantId, moduleId)).rejects.toThrow('MODULE_NOT_AVAILABLE_FOR_TIER');
    });
  });

  describe('Module Dependencies', () => {
    it('should validate module dependencies are met', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'timetable';

      const academicsModule = {
        _id: 'academics-id',
        tenantId,
        moduleId: 'academics',
        status: 'active',
        installedAt: Date.now(),
      };

      const timetableModule = {
        _id: 'timetable-id',
        tenantId,
        moduleId: 'timetable',
        status: 'active',
        installedAt: Date.now(),
        dependencies: ['academics'],
      };

      const tenant = {
        tenantId,
        name: 'Test School',
        plan: 'standard',
        status: 'active',
      };

      const organization = {
        tenantId,
        tier: 'standard',
        isActive: true,
      };

      mockDb.query.mockImplementation((table: string) => {
        if (table === 'installedModules') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                collect: vi.fn().mockResolvedValue([academicsModule, timetableModule]),
              }),
            }),
          };
        }
        if (table === 'tenants') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                first: vi.fn().mockResolvedValue(tenant),
              }),
            }),
          };
        }
        if (table === 'organizations') {
          return {
            withIndex: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(organization),
            }),
          };
        }
        return {
          withIndex: vi.fn(),
        };
      });

      const { requireModule } = await import("../../../../convex/helpers/moduleGuard");

      await expect(requireModule(mockCtx, tenantId, moduleId)).resolves.not.toThrow();
    });

    it('should deny access when dependencies are not met', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'timetable';

      const timetableModule = {
        _id: 'timetable-id',
        tenantId,
        moduleId: 'timetable',
        status: 'active',
        installedAt: Date.now(),
        dependencies: ['academics'],
      };

      const tenant = {
        tenantId,
        name: 'Test School',
        plan: 'standard',
        status: 'active',
      };

      const organization = {
        tenantId,
        tier: 'standard',
        isActive: true,
      };

      mockDb.query.mockImplementation((table: string) => {
        if (table === 'installedModules') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                collect: vi.fn().mockResolvedValue([timetableModule]),
              }),
            }),
          };
        }
        if (table === 'tenants') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                first: vi.fn().mockResolvedValue(tenant),
              }),
            }),
          };
        }
        if (table === 'organizations') {
          return {
            withIndex: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(organization),
            }),
          };
        }
        return {
          withIndex: vi.fn(),
        };
      });

      const { requireModule } = await import("../../../../convex/helpers/moduleGuard");

      await expect(requireModule(mockCtx, tenantId, moduleId)).rejects.toThrow('MODULE_DEPENDENCIES_NOT_MET');
    });
  });

  describe('Module Configuration', () => {
    it('should respect module configuration settings', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'communications';

      const configuredModule = {
        _id: 'module-id',
        tenantId,
        moduleId,
        status: 'active',
        installedAt: Date.now(),
        config: {
          smsEnabled: true,
          emailEnabled: false,
          maxDailyMessages: 100,
        },
      };

      mockDb.query.mockReturnValue({
        withIndex: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(configuredModule),
            }),
          }),
        }),
      });

      const { getModuleConfig } = await import('../../convex/helpers/moduleGuard');

      const result = await getModuleConfig(mockCtx, tenantId, moduleId);

      expect(result).toEqual(configuredModule.config);
      expect(result.smsEnabled).toBe(true);
      expect(result.emailEnabled).toBe(false);
    });

    it('should handle missing configuration gracefully', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'library';

      const moduleWithoutConfig = {
        _id: 'module-id',
        tenantId,
        moduleId,
        status: 'active',
        installedAt: Date.now(),
        config: {},
      };

      mockDb.query.mockReturnValue({
        withIndex: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(moduleWithoutConfig),
            }),
          }),
        }),
      });

      const { getModuleConfig } = await import('../../convex/helpers/moduleGuard');

      const result = await getModuleConfig(mockCtx, tenantId, moduleId);

      expect(result).toEqual({});
    });
  });

  describe('Module Status Transitions', () => {
    it('should handle module activation', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'ecommerce';

      const inactiveModule = {
        _id: 'module-id',
        tenantId,
        moduleId,
        status: 'inactive',
        installedAt: Date.now(),
        config: {},
      };

      const tenant = {
        tenantId,
        name: 'Test School',
        plan: 'enterprise',
        status: 'active',
      };

      const organization = {
        tenantId,
        tier: 'enterprise',
        isActive: true,
      };

      mockDb.query.mockImplementation((table: string) => {
        if (table === 'installedModules') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  first: vi.fn().mockResolvedValue(inactiveModule),
                }),
              }),
            }),
          };
        }
        if (table === 'tenants') {
          return {
            withIndex: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                first: vi.fn().mockResolvedValue(tenant),
              }),
            }),
          };
        }
        if (table === 'organizations') {
          return {
            withIndex: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(organization),
            }),
          };
        }
        return {
          withIndex: vi.fn(),
        };
      });

      mockDb.patch.mockResolvedValue({
        _id: 'module-id',
        status: 'active',
      });

      const { activateModule } = await import('../../convex/helpers/moduleGuard');

      const result = await activateModule(mockCtx, tenantId, moduleId);

      expect(result).toBe(true);
      expect(mockDb.patch).toHaveBeenCalledWith('module-id', { status: 'active' });
    });

    it('should handle module deactivation', async () => {
      const tenantId = 'tenant-1';
      const moduleId = 'transport';

      const activeModule = {
        _id: 'module-id',
        tenantId,
        moduleId,
        status: 'active',
        installedAt: Date.now(),
        config: {},
      };

      mockDb.query.mockReturnValue({
        withIndex: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              first: vi.fn().mockResolvedValue(activeModule),
            }),
          }),
        }),
      });

      mockDb.patch.mockResolvedValue({
        _id: 'module-id',
        status: 'inactive',
      });

      const { deactivateModule } = await import('../../convex/helpers/moduleGuard');

      const result = await deactivateModule(mockCtx, tenantId, moduleId);

      expect(result).toBe(true);
      expect(mockDb.patch).toHaveBeenCalledWith('module-id', { status: 'inactive' });
    });
  });
});

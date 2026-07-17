'use client';

import { useAuth } from '@/features/auth';
import { Typography } from '@components/ui';
import { usePathname, useRouter } from '@i18n/navigation';
import { FolderKanban, LayoutDashboard, Logs } from 'lucide-react';
import { useTranslations } from 'next-intl';

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  path: string;
};

type MenuSection = {
  title: string | null;
  items: MenuItem[];
};

export const SidebarContent = () => {
  const { isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('sidebar');

  const menuSectionsForUser: MenuSection[] = [
    {
      title: null,
      items: [
        {
          label: t('menu.projects'),
          icon: <FolderKanban size={18} />,
          path: '/projects',
        },
        {
          label: t('menu.logs'),
          icon: <Logs size={18} />,
          path: '/logs',
        }
      ],
    },
  ];

  const menuSectionsForAdmin: MenuSection[] = [
    {
      title: t('sections.workspace'),
      items: [
        {
          label: t('menu.projects'),
          icon: <FolderKanban size={18} />,
          path: '/projects',
        },
        {
          label: t('menu.logs'),
          icon: <Logs size={18} />,
          path: '/logs',
        }
      ],
    },
  ];

  const menuSections = isAdmin ? menuSectionsForAdmin : menuSectionsForUser;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex-grow p-2">
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-3">
          {section?.title && (
            <div className="flex items-center gap-1.5 px-2 py-1">
              <Typography variant="caption" textColor="primary" className="uppercase">
                {section.title}
              </Typography>
            </div>
          )}
          <ul className="p-0">
            {section.items.map((item, itemIndex) => {
              const active = isActive(item.path);

              return (
                <li key={itemIndex} className="mb-0.5">
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full transition-all duration-200 ${
                      active ? 'bg-sidebar-primary' : 'bg-transparent'
                    } ${
                      active ? 'hover:bg-sidebar-primary/80' : 'hover:bg-sidebar-primary/30'
                    } flex items-center gap-3 rounded-lg px-3 py-2 text-left`}
                  >
                    <div
                      className={`flex min-w-[30px] items-center ${
                        active ? 'text-sidebar-primary-foreground' : 'text-text-secondary'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`text-sm ${
                        active
                          ? 'text-sidebar-primary-foreground font-semibold'
                          : 'text-text-secondary font-medium'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

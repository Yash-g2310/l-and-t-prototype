import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sidebar, 
  SidebarBody, 
  SidebarLink,
  SidebarHeader,
  SidebarFooter 
} from '../ui/sidebar';
import { 
  IconHome, 
  IconUser, 
  IconSettings,
  IconBriefcase,
  IconCalendar,
  IconUsers,
  IconLogout,
  IconChartPie
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Dashboard', href: '/', icon: <IconHome className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Projects', href: '/projects', icon: <IconBriefcase className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Schedule', href: '#', icon: <IconCalendar className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Team', href: '#', icon: <IconUsers className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Analytics', href: '#', icon: <IconChartPie className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Profile', href: '/profile', icon: <IconUser className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
    { label: 'Settings', href: '#', icon: <IconSettings className="h-5 w-5 text-neutral-500 dark:text-neutral-400" /> },
  ];

  const CustomSidebarLink = ({ link, className, ...props }) => {
    const isActive = location.pathname === link.href;

    if (link.href === '#') {
      return (
        <SidebarLink 
          link={link} 
          className={`${className} ${isActive ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
          {...props} 
        />
      );
    }

    return (
      <Link to={link.href}>
        <SidebarLink 
          link={link} 
          className={`${className} ${isActive ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
          {...props} 
        />
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-neutral-800 overflow-hidden">
      <Sidebar>
        <SidebarBody>
          <SidebarHeader>
            <div className="flex items-center">
              <span className="text-xl font-bold dark:text-white">Construction AI</span>
            </div>
          </SidebarHeader>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <CustomSidebarLink key={link.href} link={link} />
            ))}
          </div>
          <SidebarFooter>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mr-2 text-white font-medium">
                {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <div className="text-sm dark:text-neutral-300">
                <div>{user?.first_name} {user?.last_name}</div>
                <div className="text-xs text-neutral-500">{user?.role}</div>
              </div>
            </div>
            <SidebarLink 
              link={{
                label: 'Logout',
                href: '#',
                icon: <IconLogout className="h-5 w-5 text-red-500" />
              }}
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
              className="text-red-500"
            />
          </SidebarFooter>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-6 dark:border-neutral-700 dark:bg-neutral-900 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

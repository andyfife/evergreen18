'use client';

import * as React from 'react';
import { Heart, Info, Mail, Mic, Users, Shield } from 'lucide-react';

import { useUser } from '@clerk/nextjs';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

import { NavUser } from './nav-user';
import { getUserRole } from '@/app/actions/getUserRole';
import NotificationsLink from './NotificationsLink';

const data = {
  navMain: [
    {
      title: 'Who We Are',
      url: '#',
      icon: Users,
      isActive: true,
      items: [
        {
          title: 'Our Vision and Mission',
          url: '/about-us/our-vision-and-mission',
        },
        { title: 'Our Founders', url: '/about-us/our-founders' },
        { title: 'Our Legacy', url: '/about-us/our-legacy' },
        { title: 'Our Team', url: '/about-us/our-team' },
        { title: 'Our Emeriti', url: '/about-us/our-emeriti' },
      ],
    },
    {
      title: 'What We Do',
      url: '#',
      icon: Info,
      isActive: true,
      items: [
        { title: 'Our Work Overview', url: '/our-work' },
        { title: 'Family Story', url: '/our-work/family-story' },
        { title: 'Household Library', url: '/our-work/household-library' },
        { title: 'Early Childhood', url: '/our-work/early-childhood' },
        {
          title: 'Conferences and Workshops',
          url: '/our-work/conferences-and-workshops',
        },
        {
          title: 'Publications and Presentations',
          url: '/our-work/publications-and-presentations',
        },
      ],
    },
    {
      title: 'Oral History',
      url: '#',
      icon: Mic,
      isActive: true,
      items: [
        { title: 'How it Works', url: '/oral-history/how-it-works' },
        { title: 'Get Started', url: '/oral-history/get-started' },
        { title: 'Archived Stories', url: '/oral-history/archived-stories' },
      ],
    },
  ],
  projects: [
    { name: 'Contact Us', url: '/contact-us', icon: Mail },
    {
      name: 'Donate',
      url: 'https://www.globalgiving.org/donate/33117/evergreen-education-foundation/',
      icon: Heart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchRole() {
      const r = await getUserRole();
      setRole(r);
    }
    fetchRole();
  }, []);

  const isAdmin = role === 'ADMIN';

  const navMainWithAdmin = React.useMemo(() => {
    if (!isAdmin) return data.navMain;
    return [
      ...data.navMain,
      {
        title: 'Admin',
        url: '#',
        icon: Shield,
        items: [
          // { title: 'Review Content', url: '/admin/review' },
          { title: 'Contacts', url: '/admin/contacts' },
        ],
      },
    ];
  }, [isAdmin]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader />

      <SidebarContent>
        {/* <NavMain items={navMainWithAdmin} /> */}
        {/* <NavProjects projects={data.projects} /> */}

        {/* Notifications Link with Badge */}
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NotificationsLink />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarContent>

      {user && <NavUser />}

      <SidebarRail />
    </Sidebar>
  );
}

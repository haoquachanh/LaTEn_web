type NavLinks = {
  name: string;
  icon: 'course' | 'community' | 'about' | 'exam' | 'app' | 'questionnobox';
  href: string;
};
export const navLinks: NavLinks[] = [
  {
    name: 'Courses',
    icon: 'course',
    href: '/course',
  },
  {
    name: 'Community',
    icon: 'community',
    href: '/community',
  },
  {
    name: 'Examinations',
    icon: 'exam',
    href: '/examination',
  },
  {
    name: 'About',
    icon: 'about',
    href: '/about',
  },
  {
    name: 'Docs',
    icon: 'questionnobox',
    href: '/docs',
  },
  {
    name: 'Test',
    icon: 'app',
    href: '/test',
  },
];

export const socialLinks = {
  email: 'address@yoursite.com',
  github: 'https://github.com',
  facebook: 'https://facebook.com',
  youtube: 'https://youtube.com',
  linkedin: 'https://linkedin.com',
  twitter: '',
  threads: '',
  instagram: '',
};

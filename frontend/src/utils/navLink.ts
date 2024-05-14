type NavLinks = {
  name: string;
  icon: 'course' | 'community' | 'about';
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
    name: 'About',
    icon: 'about',
    href: '/about',
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

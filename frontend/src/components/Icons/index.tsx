import {
  Test,
  Mail,
  Github,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Mastodon,
  Threads,
  Instagram,
  Question,
  Account,
  About,
  Community,
  Course,
  Examination,
  App,
  CloseBox,
  Tick,
  QuestionNoBox,
  Search,
  Menu,
  Bell,
  LinkIcon,
  Profile,
  Settings,
  Theme,
  Language,
  Logout,
  Login,
  Register,
  Home,
  Dashboard,
  Library,
  Students,
} from './icons';

const componentsSocialIcons = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  mastodon: Mastodon,
  threads: Threads,
  instagram: Instagram,
};

//add the new icon which is defined in ./icons
const components = {
  question: Question,
  account: Account,
  about: About,
  community: Community,
  course: Course,
  exam: Test,
  examination: Examination,
  app: App,
  closebox: CloseBox,
  tick: Tick,
  questionnobox: QuestionNoBox,
  search: Search,
  menu: Menu,
  bell: Bell,
  link: LinkIcon,
  profile: Profile,
  settings: Settings,
  theme: Theme,
  language: Language,
  logout: Logout,
  login: Login,
  register: Register,
  home: Home,
  dashboard: Dashboard,
  library: Library,
  students: Students,
};

type SocialIconProps = {
  kind: keyof typeof componentsSocialIcons;
  href: string | undefined;
  size?: number;
};

type Icons = {
  kind: keyof typeof components;
  href?: string | undefined;
  size?: number;
  color?: string;
  className?: string;
};

export const SocialIcon = ({ kind, href, size = 8 }: SocialIconProps) => {
  if (!href || (kind === 'mail' && !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href))) return null;

  const SocialSvg = componentsSocialIcons[kind];

  return (
    <a
      className="text-sm transition-all duration-200 hover:text-primary hover:scale-110 focus:text-primary focus:scale-110 active:scale-95"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg className={`fill-current h-${size} w-${size}`} />
    </a>
  );
};

export const Icon = ({ kind, href, size = 12, color, className = '' }: Icons) => {
  const IconSvg = components[kind];
  return (
    <IconSvg
      className={`fill-current transition-all duration-200 ${className}`}
      height={size}
      width={size}
      color={color}
    />
  );
};

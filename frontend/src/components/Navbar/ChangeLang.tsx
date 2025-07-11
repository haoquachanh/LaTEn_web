import { usePathname, useRouter } from '@/navigation';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { Icon } from '../Icons';

export default function ChangeLang() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  function handleChangeLang(lang: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        {
          locale: lang,
          scroll: false,
        },
      );
    });
  }
  const langs = [
    { short: 'en', nation: 'English' },
    { short: 'vi', nation: 'Việt Nam' },
  ];
  return (
    <div title="Change Language" className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 transition-all duration-200"
        aria-label="Language"
      >
        <Icon kind="language" size={20} className="text-primary/70" />
      </div>
      <div
        tabIndex={0}
        className="top-px border-white/5 bg-base-200 shadow-2xl mt-16 border rounded-box w-56 max-h-[calc(100vh-10rem)] text-base-content overflow-y-auto dropdown-content outline outline-1 outline-black/5"
      >
        <ul className="gap-1 menu menu-sm">
          {langs.map((lang) => (
            <li key={lang.nation}>
              <button
                onClick={() => handleChangeLang(lang.short)}
                className={`${params.locale === lang.short ? 'active' : ''}`}
              >
                <span className="opacity-50 pt-px !pr-1 !pl-1.5 font-bold font-mono !text-[.6rem] tracking-widest badge badge-outline badge-sm">
                  {lang.short.toUpperCase()}
                </span>
                <span className="font-[sans-serif]">{lang.nation}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

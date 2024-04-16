import { usePathname, useRouter } from "@/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";

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
        }
      );
    });
  }
  return (
    <div title="Change Language" className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="d-flex flex-nowrap btn btn-ghost"
        aria-label="Language"
      >
        <svg
          className="w-5 h-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 512 512"
        >
          <path d="M363,176,246,464h47.24l24.49-58h90.54l24.49,58H480ZM336.31,362,363,279.85,389.69,362Z" />
          <path d="M272,320c-.25-.19-20.59-15.77-45.42-42.67,39.58-53.64,62-114.61,71.15-143.33H352V90H214V48H170V90H32v44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-32.68-43.44-47.14-75.88-47.33-76.22L143,152l-38,22,6.87,13.86c.89,1.56,17.19,37.9,54.71,86.57.92,1.21,1.85,2.39,2.78,3.57-49.72,56.86-89.15,79.09-89.66,79.47L64,368l23,36,19.3-11.47c2.2-1.67,41.33-24,92-80.78,24.52,26.28,43.22,40.83,44.3,41.67L255,362Z" />
        </svg>
        <svg
          width="12px"
          height="12px"
          className="sm:inline-block hidden opacity-60 w-2 h-2 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </div>
      <div
        tabIndex={0}
        className="top-px border-white/5 bg-base-200 shadow-2xl mt-16 border rounded-box w-56 max-h-[calc(100vh-10rem)] text-base-content overflow-y-auto dropdown-content outline outline-1 outline-black/5"
      >
        <ul className="gap-1 menu menu-sm">
          <li>
            <button className="active" onClick={() => handleChangeLang("en")}>
              <span className="opacity-50 pt-px !pr-1 !pl-1.5 font-bold font-mono !text-[.6rem] tracking-widest badge badge-outline badge-sm">
                EN
              </span>
              <span className="font-[sans-serif]">English</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleChangeLang("vi")}>
              <span className="opacity-50 pt-px !pr-1 !pl-1.5 font-bold font-mono !text-[.6rem] tracking-widest badge badge-outline badge-sm">
                VI
              </span>
              <span className="font-[sans-serif]">Vietnamese</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

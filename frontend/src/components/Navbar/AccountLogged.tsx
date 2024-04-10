export default function TheAccount() {
  return (
    <>
      <div className="avatar dropdown dropdown-end">
        <div
          className="border-2 border-secondary mx-5 border-solid rounded-full w-10"
          role="button"
          tabIndex={0}
        >
          <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
        <div
          tabIndex={0}
          className="top-px border-white/5 bg-base-200 shadow-2xl mt-16 border rounded-box w-56 max-h-[calc(100vh-10rem)] text-base-content overflow-y-auto dropdown-content outline outline-1 outline-black/5"
        >
          <ul className="menu menu-sm">
            <li></li>
          </ul>
        </div>
      </div>
    </>
  );
}

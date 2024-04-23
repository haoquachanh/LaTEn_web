export default function HomeContent() {
  return (
    <>
      <div className="bg-base-200">
        <div className="lg:flex-row flex-col hero-content">
          <img
            src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
            className="shadow-2xl rounded-lg max-w-sm"
          />
          <div>
            <h1 className="font-bold text-5xl">Laten Website ! </h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
        </div>
      </div>

      <span className="loading loading-ring loading-xs"></span>
      <span className="loading loading-ring loading-sm"></span>
      <span className="loading loading-ring loading-md"></span>
      <span className="loading loading-ring loading-lg"></span>
      <ul className="timeline timeline-vertical">
        <li>
          <div className="timeline-start timeline-box">
            First Macintosh computer
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-end timeline-box">iMac</div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-start timeline-box">iPod</div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-end timeline-box">iPhone</div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-start timeline-box">Apple Watch</div>
        </li>
      </ul>
    </>
  );
}

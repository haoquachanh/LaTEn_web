export default function CourseContent() {
  return (
    <>
      <div className="border-2 col-span-12 col-start-1 m-auto mt-3 mb-8 pt-5 sm:pt-10 pr-10 sm:pb-10 pl-10 sm:rounded-xl w-full max-w-4xl h-auto">
        <div className="gap-10 grid grid-cols-1 sm:grid-cols-2">
          <div>
            <div className="flex flex-row justify-center items-center">
              <h1 className="mb-5 font-bold text-3xl text-center sm:text-4xl">
                Market News
              </h1>
            </div>{" "}
            <span className="sm:block flex justify-center items-center font-medium text-center text-md">
              Flush your stock worries away with our website's latest news!
            </span>
          </div>{" "}
          <div className="sm:block relative hidden m-auto mt-5 sm:mt-0 mb-5 sm:mb-0">
            <svg
              className="-my-5 w-40"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation={5} result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                fill="#1E40AF"
                d="M57.6,-58.7C72.7,-42.6,81.5,-21.3,82,0.5C82.5,22.3,74.7,44.6,59.7,60.1C44.6,75.6,22.3,84.3,0,84.3C-22.3,84.2,-44.6,75.5,-61.1,60.1C-77.6,44.6,-88.3,22.3,-87.6,0.7C-86.9,-20.8,-74.7,-41.6,-58.2,-57.7C-41.6,-73.8,-20.8,-85.2,0.2,-85.4C21.3,-85.6,42.6,-74.7,57.6,-58.7Z"
                transform="translate(100 100)"
                filter="url(#glow)"
              />
            </svg>{" "}
            <div className="top-1 right-10 z-1 absolute">
              <img
                className="mr-1 w-24"
                src="https://stocknear.com/_app/immutable/assets/news_logo.CNpM1h90.png"
                alt="logo"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-5 col-start-2 bg-base-100 shadow-xl card card-compact">
        <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="justify-end card-actions">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
      <div className="col-span-5 col-start-8 bg-base-100 shadow-xl card card-compact">
        <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="justify-end card-actions">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
      {/* <div className="bg-base-100 shadow-xl w-96 card card-compact">
        <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="justify-end card-actions">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
      <div className="bg-base-100 shadow-xl w-96 card card-compact">
        <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="justify-end card-actions">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div> */}
    </>
  );
}

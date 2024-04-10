export default function CourseContent() {
  return (
    <>
      <div className="w-full m-auto  sm:rounded-xl h-auto pl-10 pr-10 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8 border-2 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 ">
          <div>
            <div className="flex flex-row justify-center items-center">
              <h1 className="text-3xl sm:text-4xl text-center font-bold mb-5">
                Market News
              </h1>
            </div>{" "}
            <span className="sm:block text-md font-medium text-center flex justify-center items-center ">
              Flush your stock worries away with our website's latest news!
            </span>
          </div>{" "}
          <div className="hidden sm:block relative m-auto mb-5 mt-5 sm:mb-0 sm:mt-0">
            <svg
              className="w-40 -my-5"
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
            <div className="z-1 absolute top-1 right-10">
              <img
                className="w-24 mr-1"
                src="https://stocknear.com/_app/immutable/assets/news_logo.CNpM1h90.png"
                alt="logo"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-compact bg-base-100 shadow-xl col-start-2 col-span-5">
        <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
      <div className="card card-compact bg-base-100 shadow-xl  col-start-8 col-span-5">
        <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
      {/* <div className="card card-compact w-96 bg-base-100 shadow-xl">
        <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
      <div className="card card-compact w-96 bg-base-100 shadow-xl">
        <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div> */}
    </>
  );
}

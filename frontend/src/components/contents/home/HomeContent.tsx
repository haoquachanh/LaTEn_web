export default function HomeContent() {
  return (
    <>
      <div className="bg-base-200 min-h-screen hero">
        <div className="lg:flex-row flex-col hero-content">
          <img
            src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
            className="shadow-2xl rounded-lg max-w-sm"
          />
          <div>
            <h1 className="font-bold text-5xl">Box Office News!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </>
  );
}

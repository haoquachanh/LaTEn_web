type Package = {
  name: string;
  content: string[];
  price: number;
};
export default function CourseContent() {
  const packages: Package[] = [
    {
      name: 'Basic',
      content: ['1. Lorem ipsum dolor sit amet', '2. Lorem ipsum dolor sit amet'],
      price: 0,
    },
    {
      name: 'Standard',
      content: ['1. Lorem ipsum dolor sit amet', '2. Lorem ipsum dolor sit amet'],
      price: 10,
    },
    {
      name: 'Premium',
      content: ['1. Lorem ipsum dolor sit amet', '2. Lorem ipsum dolor sit amet'],
      price: 20,
    },
  ];
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row lg:justify-around">
        {packages.map((item, index) => (
          <div className="border-t-2 rounded-xl bg-base-100 shadow-xl m-6" key={index}>
            <div className="flex items-center card-body">
              <h2 className="card-title">{item.name}</h2>
              <h3>${item.price}</h3>
              <div className="m-5">
                {item.content.map((i) => (
                  <p key={i}>{i}</p>
                ))}
              </div>
              <div>
                <button className="btn btn-primary h-2">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row shadow-md m-6">
        <h1>Title</h1>
        <div></div>
      </div>
    </div>
  );
}

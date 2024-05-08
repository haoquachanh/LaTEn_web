type Post = {
  title: string;
  content: string;
  img: string;
  created: Date;
  auth: string;
};
export default function Post() {
  const listPosts: Post[] = [
    {
      title: 'New movie is released!',
      content: 'Click the button to watch on Jetflix app.',
      img: 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
      auth: 'auth',
      created: new Date(),
    },
    {
      title: 'New movie is released!',
      content: 'Click the button to watch on Jetflix app.',
      img: 'https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg',
      auth: 'auth',
      created: new Date(),
    },
  ];
  return (
    <div>
      {listPosts.map((post) => (
        <div className="flex flex-col border-2 rounded-3xl mb-6 lg:mb-16">
          <div className="card-body">
            <h2 className="card-title">{post.title}</h2>
            <p>{post.content}</p>
          </div>
          <figure>
            <img src={post.img} alt="" className="w-full h-auto max-h-80 rounded-b-3xl" />
          </figure>
        </div>
      ))}
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
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
      img: '',
      auth: 'auth1',
      created: new Date(),
    },
    {
      title: 'New language course available',
      content: 'Enroll now to learn a new language with our interactive platform.',
      img: '',
      auth: 'auth2',
      created: new Date(),
    },
    {
      title: 'Community event next week',
      content: 'Join us for our weekly community gathering and practice sessions.',
      img: '',
      auth: 'auth3',
      created: new Date(),
    },
  ];
  return (
    <div className="flex flex-col w-[80%]">
      {listPosts.map((post, index) => (
        <div className="flex flex-col border-2 rounded-3xl mb-6 lg:mb-16 w-full" key={`post-${index}-${post.auth}`}>
          <div className="card-body w-full">
            <h2 className="card-title">{post.title}</h2>
            <p>{post.content}</p>
          </div>
          <figure>
            <img
              src={post.img || '/images/default-post.png'}
              alt={post.title}
              className="w-full h-auto max-h-80 rounded-b-3xl"
            />
          </figure>
        </div>
      ))}
    </div>
  );
}

'use client';
import { useState } from 'react';
import Post from './Posts';
import QandA from './QandA';

export default function Community() {
  const [topic, setTopic] = useState('posts');
  return (
    <>
      <div className="flex flex-col w-full max-h-screen">
        <div className="flex border-b-2 w-full space-x-3 mb-5">
          <button
            className={`btn rounded-b-none bg-none ml-3 ${topic === 'posts' ? 'btn-active' : ''} w-32`}
            onClick={() => setTopic('posts')}
          >
            Posts
          </button>
          <button
            onClick={() => setTopic('qanda')}
            className={`btn rounded-b-none ${topic === 'qanda' ? 'btn-active' : ''} w-32`}
          >
            Q and A
          </button>
        </div>
        <div className="flex p-5 w-full h-3/5 max-h-[calc(100vh-12rem)] overflow-y-auto justify-center">
          {topic === 'posts' ? <Post /> : <QandA />}
        </div>
      </div>
    </>
  );
}

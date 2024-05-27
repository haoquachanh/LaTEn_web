'use client';
import { useState } from 'react';
import BuyStep from './BuyStep';

type Package = {
  name: string;
  content: string[];
  price: number;
};
export default function CourseContent() {
  const packages: Package[] = [
    {
      name: 'Basic',
      content: ['1. Free video record', '2. Join a free class monthly', ''],
      price: 0,
    },
    {
      name: 'Standard',
      content: ['1. Free video record', '2. Join online class weekly', '3. Join private Zalo group'],
      price: 10,
    },
    {
      name: 'Premium',
      content: [
        '1. Free video record',
        '2. Join online class bi-weekly',
        '3. Join private Zalo group',
        '4. Fast support',
      ],
      price: 20,
    },
  ];
  return (
    <div className="flex flex-col w-full lg:h-full justify-center items-center">
      <div className="flex flex-col lg:h-3/5 w-full">
        <div className="flex flex-col h-full w-full md:flex-row lg:justify-around">
          {packages.map((item, index) => (
            <div
              className="flex flex-col justify-around border-t-2 rounded-xl bg-base-100 border-base-200 shadow-lg m-3"
              key={index}
            >
              <div className="flex items-center card-body pb-2">
                <h2 className="card-title">{item.name}</h2>
                <h3>${item.price}</h3>
                <div className="m-5">
                  {item.content.map((i) => (
                    <p key={i}>{i}</p>
                  ))}
                </div>
              </div>
              <div className="flex justify-center pb-6">
                <button className="btn btn-primary h-2">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row h-2/5 w-full">
        <BuyStep />
      </div>
    </div>
  );
}

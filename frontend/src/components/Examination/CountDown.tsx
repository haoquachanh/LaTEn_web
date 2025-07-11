'use client';
import { ExaminationContext } from '@/contexts/ExaminationContext';
import React, { useContext } from 'react';
const Countdown = () => {
  const { second } = useContext(ExaminationContext);
  return (
    <div className="flex justify-end">
      {second > 0 ? (
        <div className="flex justify-end">
          <h1 className="font-mono text-md lg:text-2xl">
            {`${second >= 32400 ? `${Math.floor(second / 3600)}` : `0${Math.floor(second / 3600)}`}`}:
          </h1>
          <h1 className="font-mono text-md lg:text-2xl">
            {`${(second % 3600) / 60 >= 10 ? `${Math.floor((second % 3600) / 60)}` : `0${Math.floor((second % 3600) / 60)}`}`}
            :
          </h1>
          <h1 className="font-mono text-md lg:text-2xl">{`${second % 60 > 9 ? `${second % 60}` : `0${second % 60}`}`}</h1>
        </div>
      ) : (
        <h1>Time's up!</h1>
      )}
    </div>
  );
};

export default Countdown;

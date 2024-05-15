import React, { useState, useEffect } from 'react';
const Countdown = ({ initialTime = 900 }: { initialTime: number }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time > 0) {
      const timerId = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [time]);

  return (
    <div className="flex justify-end">
      {time > 0 ? (
        <div className="flex justify-end">
          <h1 className="font-mono text-md lg:text-2xl">
            {`${time >= 32400 ? `${Math.floor(time / 3600)}` : `0${Math.floor(time / 3600)}`}`}:
          </h1>
          <h1 className="font-mono text-md lg:text-2xl">
            {`${(time % 3600) / 60 >= 10 ? `${Math.floor((time % 3600) / 60)}` : `0${Math.floor((time % 3600) / 60)}`}`}
            :
          </h1>
          <h1 className="font-mono text-md lg:text-2xl">{`${time % 60 > 9 ? `${time % 60}` : `0${time % 60}`}`}</h1>
        </div>
      ) : (
        <h1>Time's up!</h1>
      )}
    </div>
  );
};

export default Countdown;

'use client';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { getApi } from '@/utils/axiosCofig.ts';

interface UserData {
  fullname?: string;
  email?: string;
  avatar?: string;
  role?: string;
  id?: string;
  created?: string;
  updated?: string;
  birth?: string;
  phone?: string;
  status?: string;
}

export default function ProfileContent() {
  const [userData, setData] = useState<UserData>({});
  const { access_token } = useContext(AuthContext);
  useEffect(() => {
    async function getInfo() {
      if (!access_token) return;
      const data = await getApi('user/profile', access_token);
      console.log('🚀 ~ ProfileContent ~ data:', data);
      setData(data);
    }
    getInfo();
  }, [access_token]);
  return (
    <div>
      <div className="card bg-base-100 from-base-200 not-prose outline-base-content/5 relative overflow-hidden bg-gradient-to-b font-sans shadow-lg outline -outline-offset-1 md:flex-row-reverse">
        <div className="bg-accent -left-1/5 pointer-events-none absolute bottom-[-50%] aspect-square w-3/4 -translate-x-1/2 rounded-full opacity-20 blur-3xl"></div>{' '}
        <div className="bg-primary pointer-events-none absolute bottom-[-120%] left-1/2 aspect-square w-full -translate-x-1/2 rounded-full opacity-20 blur-3xl"></div>{' '}
        <div className="bg-base-100 pointer-events-none absolute -top-3/4 right-1/4 z-[3] aspect-square w-1/2 rounded-full opacity-60 blur-3xl"></div>{' '}
        <div className="card-body relative isolate z-[3]">
          <div className="flex flex-row items-center justify-center space-x-20">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <div className="ml-5">
              <h1 className="card-title">{userData.fullname}</h1>
              <p>Web Developer</p>
            </div>
          </div>
        </div>
      </div>
      <div role="tablist" className="tabs tabs-bordered mt-12">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab mx-5 px-5"
          aria-label="Infomation"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content p-10">
          <h1>John Doe</h1>
          <p>Web Developer</p>
          <p>{userData.created}</p>
          <p>John Doe is a web developer</p>
        </div>

        <input type="radio" name="my_tabs_1" role="tab" className="tab mx-5 px-5" aria-label="Setting" />
        <div role="tabpanel" className="tab-content p-10">
          <button className="btn btn-warning">Change password</button>
          <button className="btn btn-error">Delete accout</button>
        </div>

        <input type="radio" name="my_tabs_1" role="tab" className="tab mx-5 px-5" aria-label="My Courses" />
        <div role="tabpanel" className="tab-content p-10">
          Comming soon!
        </div>
      </div>
    </div>
  );
}

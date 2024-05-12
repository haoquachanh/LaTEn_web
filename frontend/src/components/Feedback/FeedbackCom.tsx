/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useRef, useState } from 'react';

export default function FeedbackCom() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const feedbackEmo = ['verygood', 'good', 'normal', 'bad'];
  const feedbackIcons = [
    "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2048'%3e%3cdefs%3e%3cstyle%3e.cls-1{fill:%23ffce52;}.cls-2{fill:%23ffe369;}.cls-3{fill:%23ffb32b;}.cls-4{fill:%23f6fafd;}.cls-5{fill:%23273941;}.cls-6{fill:%23ae2d4c;}.cls-7{fill:%23cf4054;}.cls-8{fill:%23141e21;}.cls-9{fill:%238a293d;}.cls-10{fill:%23fbb40a;}%3c/style%3e%3c/defs%3e%3ctitle%3e13-love%3c/title%3e%3cg%20id='_13-love'%20data-name='13-love'%3e%3ccircle%20class='cls-1'%20cx='24'%20cy='24'%20r='23'/%3e%3cpath%20class='cls-2'%20d='M24,4c12.15,0,22,8.507,22,19h.975a23,23,0,0,0-45.95,0H2C2,12.507,11.85,4,24,4Z'/%3e%3cpath%20class='cls-3'%20d='M46,23c0,10.493-9.85,19-22,19S2,33.493,2,23H1.025c-.014.332-.025.665-.025,1a23,23,0,0,0,46,0c0-.335-.011-.668-.025-1Z'/%3e%3cellipse%20class='cls-4'%20cx='37'%20cy='9'%20rx='0.825'%20ry='1.148'%20transform='translate(4.48%2028.81)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-4'%20cx='30.746'%20cy='4.5'%20rx='0.413'%20ry='0.574'%20transform='translate(5.829%2023.067)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-4'%20cx='34'%20cy='7'%20rx='1.65'%20ry='2.297'%20transform='translate(5.015%2026.102)%20rotate(-45.02)'/%3e%3cpath%20class='cls-5'%20d='M34,39c0-2.76-4.47-5-10-5s-10,2.24-10,5l-.1.13A10.727,10.727,0,0,1,9,30.15,2.025,2.025,0,0,1,10.87,28c1.88,1.08,6.39,1,13.13,1s11.25.08,13.12-1A2.026,2.026,0,0,1,39,30.15a10.727,10.727,0,0,1-4.9,8.98Z'/%3e%3cpath%20class='cls-6'%20d='M34,39l.1.13A17.882,17.882,0,0,1,24,42a17.882,17.882,0,0,1-10.1-2.87L14,39c0-2.76,4.47-5,10-5S34,36.24,34,39Z'/%3e%3cpath%20class='cls-7'%20d='M16.5,9A4.465,4.465,0,0,1,21,13.8C21,21,13.5,25,12,25c-.72,0-8.38-3.7-8.97-10.39Q3,14.205,3,13.8A4.451,4.451,0,0,1,6.58,9.1,4.053,4.053,0,0,1,7.5,9c2.25,0,3.75,1.6,4.5,4C12.75,10.6,14.25,9,16.5,9Z'/%3e%3cpath%20class='cls-7'%20d='M45,13.8q0,.4-.03.81C44.44,21.3,37.44,25,36,25c-.75,0-9-4-9-11.2A4.465,4.465,0,0,1,31.5,9c2.25,0,3.75,1.6,4.5,4,.75-2.4,2.25-4,4.5-4a4.053,4.053,0,0,1,.92.1A4.451,4.451,0,0,1,45,13.8Z'/%3e%3cpath%20class='cls-8'%20d='M10.87,30c1.88,1.08,6.39,1,13.13,1s11.25.08,13.12-1a1.926,1.926,0,0,1,1.793,1.536A11.043,11.043,0,0,0,39,30.15,2.026,2.026,0,0,0,37.12,28c-1.87,1.08-6.38,1-13.12,1s-11.25.08-13.13-1A2.025,2.025,0,0,0,9,30.15a11.015,11.015,0,0,0,.087,1.385A1.92,1.92,0,0,1,10.87,30Z'/%3e%3cpath%20class='cls-9'%20d='M33.531,37.486A18.171,18.171,0,0,1,24,40a18.171,18.171,0,0,1-9.531-2.514A2.809,2.809,0,0,0,14,39l-.1.13A17.882,17.882,0,0,0,24,42a17.882,17.882,0,0,0,10.1-2.87L34,39A2.809,2.809,0,0,0,33.531,37.486Z'/%3e%3cpath%20class='cls-10'%20d='M36,25c-.71,0-8.131-3.59-8.921-10.081A6,6,0,0,0,27,15.8C27,23,35.25,27,36,27c1.44,0,8.44-3.7,8.97-10.39Q45,16.2,45,15.8a6.079,6.079,0,0,0-.07-.907C44.225,21.4,37.419,25,36,25Z'/%3e%3cpath%20class='cls-10'%20d='M12,25c-.71,0-8.131-3.59-8.921-10.081A6,6,0,0,0,3,15.8C3,23,11.25,27,12,27c1.44,0,8.44-3.7,8.97-10.39Q21,16.2,21,15.8a6.079,6.079,0,0,0-.07-.907C20.225,21.4,13.419,25,12,25Z'/%3e%3cpath%20class='cls-6'%20d='M40.5,9c-2.25,0-3.75,1.6-4.5,4,.583-1.8,1.75-3,3.5-3A3.408,3.408,0,0,1,43,13.6C43,19,37.167,22,36,22c-.56,0-6.518-2.775-6.977-7.793-.015-.2-.023-.405-.023-.607a3.366,3.366,0,0,1,2.784-3.525A3.243,3.243,0,0,1,32.5,10c1.75,0,2.917,1.2,3.5,3-.75-2.4-2.25-4-4.5-4a4.053,4.053,0,0,0-.92.1A4.451,4.451,0,0,0,27,13.8q0,.4.03.81C27.62,21.3,35.28,25,36,25c1.5,0,9-4,9-11.2A4.465,4.465,0,0,0,40.5,9Z'/%3e%3cpath%20class='cls-6'%20d='M16.5,9c-2.25,0-3.75,1.6-4.5,4,.583-1.8,1.75-3,3.5-3A3.408,3.408,0,0,1,19,13.6C19,19,13.167,22,12,22c-.56,0-6.518-2.775-6.977-7.793C5.008,14.005,5,13.8,5,13.6a3.366,3.366,0,0,1,2.784-3.525A3.243,3.243,0,0,1,8.5,10c1.75,0,2.917,1.2,3.5,3-.75-2.4-2.25-4-4.5-4a4.053,4.053,0,0,0-.92.1A4.451,4.451,0,0,0,3,13.8q0,.4.03.81C3.62,21.3,11.28,25,12,25c1.5,0,9-4,9-11.2A4.465,4.465,0,0,0,16.5,9Z'/%3e%3cellipse%20class='cls-4'%20cx='42'%20cy='13'%20rx='0.825'%20ry='1.148'%20transform='translate(3.116%2033.519)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-4'%20cx='40.746'%20cy='11.5'%20rx='0.413'%20ry='0.574'%20transform='translate(3.809%2032.193)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-4'%20cx='18'%20cy='13'%20rx='0.825'%20ry='1.148'%20transform='translate(-3.919%2016.543)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-4'%20cx='16.746'%20cy='11.5'%20rx='0.413'%20ry='0.574'%20transform='translate(-3.226%2015.216)%20rotate(-45.02)'/%3e%3c/g%3e%3c/svg%3e",
    "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2048'%3e%3cdefs%3e%3cstyle%3e.cls-1{fill:%23ffce52;}.cls-2{fill:%23273941;}.cls-3{fill:%23ffe369;}.cls-4{fill:%23ffb32b;}.cls-5{fill:%23f6fafd;}%3c/style%3e%3c/defs%3e%3ctitle%3e03-smile%3c/title%3e%3cg%20id='_03-smile'%20data-name='03-smile'%3e%3ccircle%20class='cls-1'%20cx='24'%20cy='24'%20r='23'/%3e%3cpath%20class='cls-2'%20d='M24,39c-7.168,0-13-4.935-13-11h2c0,4.962,4.935,9,11,9s11-4.038,11-9h2C37,34.065,31.168,39,24,39Z'/%3e%3cpath%20class='cls-2'%20d='M20,21H18c0-2.206-1.346-4-3-4s-3,1.794-3,4H10c0-3.309,2.243-6,5-6S20,17.691,20,21Z'/%3e%3cpath%20class='cls-2'%20d='M38,21H36c0-2.206-1.346-4-3-4s-3,1.794-3,4H28c0-3.309,2.243-6,5-6S38,17.691,38,21Z'/%3e%3cpath%20class='cls-3'%20d='M24,4c12.15,0,22,8.507,22,19h.975a23,23,0,0,0-45.95,0H2C2,12.507,11.85,4,24,4Z'/%3e%3cpath%20class='cls-4'%20d='M46,23c0,10.493-9.85,19-22,19S2,33.493,2,23H1.025c-.014.332-.025.665-.025,1a23,23,0,0,0,46,0c0-.335-.011-.668-.025-1Z'/%3e%3cellipse%20class='cls-5'%20cx='37'%20cy='9'%20rx='0.825'%20ry='1.148'%20transform='translate(4.48%2028.81)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-5'%20cx='30.746'%20cy='4.5'%20rx='0.413'%20ry='0.574'%20transform='translate(5.829%2023.067)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-5'%20cx='34'%20cy='7'%20rx='1.65'%20ry='2.297'%20transform='translate(5.015%2026.102)%20rotate(-45.02)'/%3e%3c/g%3e%3c/svg%3e",
    "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%2048%2048'%3e%3cdefs%3e%3cstyle%3e.cls-1{fill:%23ffce52;}.cls-2{fill:url(%23radial-gradient);}.cls-3{fill:%23ffb32b;}.cls-4{fill:%23273941;}.cls-5{fill:%23141e21;}.cls-6{fill:%23f6fafd;}.cls-7{fill:%233bc5f6;}.cls-8{fill:%2300a3e1;}%3c/style%3e%3cradialGradient%20id='radial-gradient'%20cx='-27.957'%20cy='8.563'%20r='6'%20gradientTransform='translate(107.871%20-4.408)%20scale(3%202.5)'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0'%20stop-color='%235987dd'/%3e%3cstop%20offset='0.118'%20stop-color='%23638bd6'/%3e%3cstop%20offset='0.316'%20stop-color='%237d98c3'/%3e%3cstop%20offset='0.572'%20stop-color='%23a8aba3'/%3e%3cstop%20offset='0.871'%20stop-color='%23e3c678'/%3e%3cstop%20offset='1'%20stop-color='%23ffd364'/%3e%3c/radialGradient%3e%3c/defs%3e%3ctitle%3e27-feel%20bad%3c/title%3e%3cg%20id='_27-feel_bad'%20data-name='27-feel%20bad'%3e%3ccircle%20class='cls-1'%20cx='24'%20cy='24'%20r='23'/%3e%3cellipse%20class='cls-2'%20cx='24'%20cy='17'%20rx='18'%20ry='15'/%3e%3cpath%20class='cls-3'%20d='M46,23c0,10.493-9.85,19-22,19S2,33.493,2,23H1.025c-.014.332-.025.665-.025,1a23,23,0,0,0,46,0c0-.335-.011-.668-.025-1Z'/%3e%3cellipse%20class='cls-4'%20cx='33'%20cy='23'%20rx='3'%20ry='4'/%3e%3cellipse%20class='cls-5'%20cx='33'%20cy='23'%20rx='2'%20ry='3'/%3e%3ccircle%20class='cls-6'%20cx='34'%20cy='22'%20r='1'/%3e%3cellipse%20class='cls-4'%20cx='15'%20cy='23'%20rx='3'%20ry='4'/%3e%3cellipse%20class='cls-5'%20cx='15'%20cy='23'%20rx='2'%20ry='3'/%3e%3ccircle%20class='cls-6'%20cx='16'%20cy='22'%20r='1'/%3e%3cpath%20class='cls-5'%20d='M10,19V17c3.722,0,6-1.295,6-2h2C18,17.626,13.976,19,10,19Z'/%3e%3cpath%20class='cls-5'%20d='M38,19c-3.976,0-8-1.374-8-4h2c0,.705,2.278,2,6,2Z'/%3e%3cpath%20class='cls-4'%20d='M24,35H18.5A5.265,5.265,0,0,1,24,30a5.265,5.265,0,0,1,5.5,5Z'/%3e%3cpath%20class='cls-5'%20d='M24,31a5.4,5.4,0,0,1,5.39,4h.11A5.265,5.265,0,0,0,24,30a5.265,5.265,0,0,0-5.5,5h.11A5.4,5.4,0,0,1,24,31Z'/%3e%3cpath%20class='cls-7'%20d='M47,12a4,4,0,0,1-8,0c0-2.209,3-8,4-8S47,9.791,47,12Z'/%3e%3cpath%20class='cls-8'%20d='M43,4c-1,0-4,5.791-4,8a4,4,0,0,0,8,0C47,9.791,44,4,43,4Zm0,8.5a2.848,2.848,0,0,1-3-2.667C40,8.361,42.25,4.5,43,4.5s3,3.861,3,5.333A2.848,2.848,0,0,1,43,12.5Z'/%3e%3cpath%20class='cls-3'%20d='M43,16a3.991,3.991,0,0,1-3.861-3.008A4.661,4.661,0,0,0,39,14a4,4,0,0,0,6.846,2.807q-.255-.777-.562-1.529A3.982,3.982,0,0,1,43,16Z'/%3e%3cellipse%20class='cls-6'%20cx='44'%20cy='11'%20rx='0.825'%20ry='1.148'%20transform='translate(5.117%2034.348)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-6'%20cx='44.746'%20cy='9.5'%20rx='0.413'%20ry='0.574'%20transform='translate(6.397%2034.436)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-6'%20cx='36'%20cy='9'%20rx='0.825'%20ry='1.148'%20transform='translate(4.187%2028.103)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-6'%20cx='29.746'%20cy='4.5'%20rx='0.413'%20ry='0.574'%20transform='translate(5.536%2022.36)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-6'%20cx='33'%20cy='7'%20rx='1.65'%20ry='2.297'%20transform='translate(4.722%2025.394)%20rotate(-45.02)'/%3e%3c/g%3e%3c/svg%3e",
    "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2048'%3e%3cdefs%3e%3cstyle%3e.cls-1{fill:%23cf4054;}.cls-2{fill:%23f45269;}.cls-3{fill:%23ae2d4c;}.cls-4{fill:%23f6fafd;}.cls-5{fill:%23141e21;}.cls-6{fill:%23273941;}%3c/style%3e%3c/defs%3e%3ctitle%3e28-angry%3c/title%3e%3cg%20id='_28-angry'%20data-name='28-angry'%3e%3ccircle%20class='cls-1'%20cx='24'%20cy='24'%20r='23'/%3e%3cpath%20class='cls-2'%20d='M24,4c12.15,0,22,8.507,22,19h.975a23,23,0,0,0-45.95,0H2C2,12.507,11.85,4,24,4Z'/%3e%3cpath%20class='cls-3'%20d='M46,23c0,10.493-9.85,19-22,19S2,33.493,2,23H1.025c-.014.332-.025.665-.025,1a23,23,0,0,0,46,0c0-.335-.011-.668-.025-1Z'/%3e%3cellipse%20class='cls-4'%20cx='36.5'%20cy='8.5'%20rx='0.825'%20ry='1.148'%20transform='translate(4.687%2028.31)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-4'%20cx='30.246'%20cy='4'%20rx='0.413'%20ry='0.574'%20transform='translate(6.037%2022.567)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-4'%20cx='33.5'%20cy='6.5'%20rx='1.65'%20ry='2.297'%20transform='translate(5.222%2025.602)%20rotate(-45.02)'/%3e%3cellipse%20class='cls-3'%20cx='24'%20cy='25'%20rx='10'%20ry='2'/%3e%3cpath%20class='cls-5'%20d='M39.447,16.9l-.894-1.79-4.934,2.467h0l-2.927,1.464-.136.068.015.03a.982.982,0,0,0-.4.55A5.335,5.335,0,0,0,30,21c0,2.243,1.317,4,3,4s3-1.757,3-4a5.011,5.011,0,0,0-.483-2.14Z'/%3e%3cpath%20class='cls-5'%20d='M17.432,19.135l.015-.03-.136-.068-2.927-1.464h0L9.447,15.105,8.553,16.9l3.93,1.965A5.011,5.011,0,0,0,12,21c0,2.243,1.317,4,3,4s3-1.757,3-4a5.335,5.335,0,0,0-.168-1.315A.982.982,0,0,0,17.432,19.135Z'/%3e%3cpath%20class='cls-6'%20d='M16.86,19.93A4.07,4.07,0,0,1,17,21c0,1.66-.9,3-2,3s-2-1.34-2-3a3.516,3.516,0,0,1,.94-2.53Z'/%3e%3cpath%20class='cls-6'%20d='M35,21c0,1.66-.9,3-2,3s-2-1.34-2-3a4.07,4.07,0,0,1,.14-1.07l2.92-1.46A3.516,3.516,0,0,1,35,21Z'/%3e%3cpath%20class='cls-5'%20d='M31,36H29c0-1.812-2.23-4-5-4s-5,2.188-5,4H17c0-2.832,2.993-6,7-6S31,33.168,31,36Z'/%3e%3c/g%3e%3c/svg%3e",
  ];
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowFeedback(false);
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showFeedback]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
        setShowFeedback(false);
      }
    };
    if (showFeedback) {
      window.addEventListener('mouseup', handleOutsideClick);
    }
    return () => {
      window.removeEventListener('mouseup', handleOutsideClick);
    };
  }, [showFeedback]);

  return (
    <>
      <div
        className={`${
          showFeedback ? 'flex' : 'hidden'
        } fixed top-0 left-0 z-15 w-screen h-screen items-center justify-center`}
      >
        <div className="modal-box w-full bg-[#000]" ref={wrapperRef}>
          <div className="flex flex-row items-center pt-5 justify-center">
            <h1 className="text-white text-xl sm:text-2xl font-bold">Your Feedback matters!</h1>
          </div>
          <div className="p-2 mt-5 w-full ">
            <textarea
              className="textarea textarea-bordered placeholder-gray-300 w-full bg-[#1F1F23] text-white border border-gray-600"
              placeholder="Your feedback..."
              spellCheck="false"
              defaultValue={''}
            />
          </div>
          <ul className="flex gap-5 justify-center mt-5 mb-5">
            {feedbackEmo.map((emo, index) => (
              <li className="cursor-pointer" key={index} onClick={() => setFeedback(emo)}>
                <div
                  className={`rounded-full w-16 h-16 relative hover:bg-[#333333] flex items-center justify-center ${
                    emo === feedback ? ' bg-[#333333]' : ''
                  }`}
                >
                  <img className="w-8 h-8 sm:w-10 sm:h-10" src={feedbackIcons[index]} loading="lazy" />
                </div>
              </li>
            ))}
          </ul>
          <button className="mb-4 btn bg-blue-700 hover:bg-blue-600 opacity-60 cursor-default btn-md w-full rounded-full m-auto text-white font-bold text-md">
            Send Feedback
          </button>
        </div>
      </div>

      <div
        id="feedbackInfo"
        className="fixed z-15 bottom-8 sm:bottom-10 right-8 sm:right-10"
        onClick={(e) => {
          setShowFeedback(!showFeedback);
        }}
        ref={buttonRef}
      >
        <label
          htmlFor="feedbackInfo"
          className="inline-flex items-center justify-center w-12 h-12 sm:w-full sm:h-10 font-medium bg-gray-700 sm:bg-[#FFEDE5] ml-1 mr-0 sm:mr-2 rounded-full cursor-pointer border-2 border-[black]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="sm:hidden sm:ml-4 w-6 h-6 text-white inline-block"
            viewBox="0 0 256 256"
          >
            <path
              fill="white"
              d="M140 180a12 12 0 1 1-12-12a12 12 0 0 1 12 12M128 72c-22.06 0-40 16.15-40 36v4a8 8 0 0 0 16 0v-4c0-11 10.77-20 24-20s24 9 24 20s-10.77 20-24 20a8 8 0 0 0-8 8v8a8 8 0 0 0 16 0v-.72c18.24-3.35 32-17.9 32-35.28c0-19.85-17.94-36-40-36m104 56A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88"
            />
          </svg>
          <span className="text-black hidden sm:block text-md px-3">Feedback</span>
          <img
            className="hidden sm:inline-block w-12 -mt-6 opacity-[1]"
            src="https://d1cwu67pi1m619.cloudfront.net/assets/feedback_icon.png"
            alt="feedback logo"
          />
        </label>
      </div>
    </>
  );
}

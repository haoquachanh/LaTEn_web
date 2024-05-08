import Post from './Posts';
import QandA from './QandA';

export default function Community() {
  return (
    <>
      <div className="flex flex-row w-full">
        <div className="flex w-full align-middle justify-center">
          <div role="tablist" className="tabs tabs-bordered w-full">
            <input type="radio" name="my_tabs_1" role="tab" className="tab !w-32" aria-label="Posts" defaultChecked />
            <div role="tabpanel" className="tab-content p-10">
              <Post />
              {/* Tab content 1 */}
            </div>

            <input type="radio" name="my_tabs_1" role="tab" className="tab !w-32" aria-label="Q & A" />
            <div role="tabpanel" className="tab-content p-10">
              <QandA />
            </div>
          </div>
        </div>
        {/* <div className="flex w-1/5"> */}
        {/* <div> */}
        {/* <h2>About Community</h2> */}
        {/* </div> */}
        {/* </div> */}
      </div>
    </>
  );
}

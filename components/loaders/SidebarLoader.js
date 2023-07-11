import React from 'react';

const SidebarLoader = ({numRecords}) => {
  let rows = [];
  for (let i = 0; i < numRecords; i++) {
    rows.push(<LoaderRow key={i}/>);
  }

  return (
      <>
        {rows}
      </>
  );
};

export default SidebarLoader;

const LoaderRow = () => {
  return (
      <div className="flex w-full flex-1 flex-col items-center">
        <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 p-4 border-t border-slate-500">
          <div className="flex flex-col space-y-2">
            <div className="h-4 w-7/12 rounded bg-gray-300"></div>
            <div className="h-4 w-8/12 rounded bg-gray-300"></div>
            <div className="h-4 w-11/12 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
  );
};

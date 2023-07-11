import React from 'react';

const ContentLoader = () => {

  return (
      <>
        <CoverLoader/>
        <DetailsLoader/>
      </>
  );
};

export default ContentLoader;


const CoverLoader = () => {
  return (
      <div className="w-full h-1/3">
        <div className="w-full animate-pulse h-full">
          <div className="space-y-2 block h-full">
            <div className="h-full border w-full rounded bg-gray-300"/>
          </div>
        </div>
      </div>
  );
};

const DetailsLoader = () => {
  return (
      <div className="flex w-full flex-1 flex-col items-center">
        <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 p-16">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row space-x-3">
              <div className="h-16 w-16 rounded-full bg-gray-300"/>
              <div className="h-16 w-16 rounded-full bg-gray-300"/>
            </div>
            <div className="h-16 w-3/12 rounded bg-gray-300"/>
            <div className="h-8 w-4/12 rounded bg-gray-300"/>
            <div className="h-8 w-5/12 rounded bg-gray-300"/>
          </div>
        </div>
      </div>
  );
};

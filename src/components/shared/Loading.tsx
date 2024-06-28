import React from "react";
import logoPng from "assets/svgs/logo-bg.svg";

const Loading = () => {
  return (
    <div className="flex justify-center h-screen items-center p-8">
      <div>
        <img
          src={logoPng}
          alt="logo"
          className="mx-auto animate-bounce"
          // width={200}
        />
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;

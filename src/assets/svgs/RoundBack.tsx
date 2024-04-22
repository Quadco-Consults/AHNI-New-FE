const RoundBack = () => {
  return (
    <svg
      width="84"
      height="84"
      viewBox="0 0 84 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" cursor-pointer "
    >
      <g filter="url(#filter0_d_2915_28068)">
        <rect x="18" y="14" width="48" height="48" rx="24" fill="white" />
        <path
          opacity="0.4"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M33 38C33 37.4477 33.4477 37 34 37L50 37C50.5523 37 51 37.4477 51 38C51 38.5523 50.5523 39 50 39L34 39C33.4477 39 33 38.5523 33 38Z"
          fill="#FF0000"
        />
        <path
          d="M35.0279 38C35.1212 38.1548 35.3168 38.4329 35.5306 38.6749C35.9564 39.1568 36.5431 39.7072 37.1556 40.2389C37.7631 40.7664 38.3736 41.2564 38.834 41.6156C39.0636 41.7948 39.4599 42.0942 39.5931 42.1948C40.0377 42.5223 40.1327 43.1483 39.8052 43.5929C39.4777 44.0376 38.8517 44.1326 38.407 43.8051L38.4033 43.8023C38.2589 43.6933 37.8403 43.3771 37.6035 43.1923C37.1264 42.82 36.4869 42.307 35.8444 41.7492C35.2069 41.1957 34.5436 40.5784 34.0319 39.9992C33.777 39.7108 33.5386 39.4082 33.3584 39.1094C33.1948 38.838 33 38.4432 33 38C33 37.5569 33.1948 37.162 33.3584 36.8906C33.5386 36.5918 33.777 36.2892 34.0319 36.0008C34.5436 35.4216 35.2069 34.8043 35.8444 34.2508C36.4869 33.693 37.1264 33.18 37.6035 32.8077C37.8403 32.6229 38.2586 32.3069 38.403 32.1979L38.407 32.1949C38.8517 31.8674 39.4777 31.9624 39.8052 32.4071C40.1327 32.8517 40.0377 33.4777 39.5931 33.8052C39.4599 33.9058 39.0636 34.2052 38.834 34.3844C38.3736 34.7436 37.7631 35.2336 37.1556 35.7611C36.5431 36.2928 35.9564 36.8432 35.5306 37.3251C35.3168 37.5671 35.1212 37.8452 35.0279 38Z"
          fill="#FF0000"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2915_28068"
          x="0"
          y="0"
          width="84"
          height="84"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="4"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_2915_28068"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="7" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2915_28068"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2915_28068"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default RoundBack;

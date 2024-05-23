const CarIcon = () => {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="38" height="38" fill="url(#pattern0_4225_1423)" />
      <defs>
        <pattern
          id="pattern0_4225_1423"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_4225_1423" transform="scale(0.01)" />
        </pattern>
        <image
          id="image0_4225_1423"
          width="100"
          height="100"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default CarIcon;

type Props = {
  size?: string;
  fillColor?: string;
};

const CompletedProcurementIcon = ({
  size = "62",
  fillColor = "currentColor",
}: Props) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 55 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1.16699" y="0.5" width="53" height="53" rx="3.5" stroke="none" />
      <path
        opacity="0.4"
        d="M6.16699 27.0004C6.16699 38.8745 15.7929 48.5004 27.667 48.5004C39.5411 48.5004 49.167 38.8745 49.167 27.0004C49.167 15.1262 39.5411 5.50037 27.667 5.50037C15.7929 5.50037 6.16699 15.1262 6.16699 27.0004Z"
        fill={fillColor}
      />
      <path
        d="M19.667 28.0004C19.667 28.0004 22.667 28.0004 26.667 35.0004C26.667 35.0004 37.7846 16.667 47.667 13.0004"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CompletedProcurementIcon;

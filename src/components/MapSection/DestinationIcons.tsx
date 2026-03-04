import React from "react";

// Destination Icon Components - SVG icons from Figma
const DestinationIcons = {
  entertainment: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      className={className}
    >
      <path
        d="M38.5 14.5V20.5M38.5 31.5V37.5M38.5 49.5V55.5M64.5 13C65.3284 13 66 13.6716 66 14.5V26H65C60.0294 26 56 30.0294 56 35C56 39.9706 60.0294 44 65 44H66V55.5C66 56.3284 65.3284 57 64.5 57H6.5C5.67157 57 5 56.3284 5 55.5V44H6C10.9706 44 15 39.9706 15 35C15 30.0294 10.9706 26 6 26H5V14.5C5 13.6716 5.67157 13 6.5 13H64.5Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  culture: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      className={className}
    >
      <path
        d="M64.1654 35C64.1654 51.1084 51.107 64.1667 34.9987 64.1667M64.1654 35C64.1654 18.8917 51.107 5.83337 34.9987 5.83337M64.1654 35H5.83203M34.9987 64.1667C18.8904 64.1667 5.83203 51.1084 5.83203 35M34.9987 64.1667C27.5094 56.3029 23.332 45.8596 23.332 35C23.332 24.1405 27.5094 13.6972 34.9987 5.83337M34.9987 64.1667C42.488 56.3029 46.6654 45.8596 46.6654 35C46.6654 24.1405 42.488 13.6972 34.9987 5.83337M5.83203 35C5.83203 18.8917 18.8904 5.83337 34.9987 5.83337"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  education: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      className={className}
    >
      <path
        d="M15.5 32V42.6309C15.5001 44.3145 15.9473 46.188 17.333 47.5918C19.8345 50.1257 25.386 54.0762 35.5 54.0762C45.614 54.0762 51.1655 50.1257 53.667 47.5918C55.0527 46.188 55.4999 44.3145 55.5 42.6309V32M66 28V45M35.5 15L66 27.5L35.5 40L5 27.5L35.5 15Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  community: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      className={className}
    >
      <path
        d="M52 64V6H18V64M52 64H18M52 64H64V26H52V64ZM18 64V35H6V64H18ZM29.5 18H41M29.5 29.5H41M29.5 41H41M29.5 52.5H41"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  shopping: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      className={className}
    >
      <path
        d="M9 17H61M9 17V64H61V17M9 17L17 6H53L61 17M47 29C47 35.6274 41.6274 41 35 41C28.3726 41 23 35.6274 23 29"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  nature: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      className={className}
    >
      <path
        d="M37 55V63M20 46L20 63M31.5 12.8235L37 7L54 25H46.2L60 40H51.9677L66 55H32.5M19.5 19C24.1944 19 28 22.8056 28 27.5C28 27.7908 27.9846 28.0781 27.9561 28.3613C31.4529 29.4151 34 32.6596 34 36.5V37.5C34 42.1944 30.1944 46 25.5 46H13.5C8.80558 46 5 42.1944 5 37.5V36.5C5 32.66 7.54662 29.4154 11.043 28.3613C11.0145 28.0781 11 27.7907 11 27.5C11 22.8056 14.8056 19 19.5 19Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  garden: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      className={className}
    >
      <path
        d="M35 51V63M47.5 33C54.4036 33 60 38.3726 60 45C60 51.6274 54.4036 57 47.5 57C40.5964 57 35 51.6274 35 45M47.5 33C46.6339 33 45.7882 33.0841 44.9717 33.2451C44.6116 38.6364 40.3788 42.9019 35.1738 42.9951C35.0596 43.6471 35 44.3169 35 45M47.5 33C54.4036 33 60 27.4036 60 20.5C60 13.5964 54.4036 8 47.5 8C40.5964 8 35 13.5964 35 20.5M47.5 33C46.6417 33 45.8038 32.9128 44.9941 32.748C44.996 32.6656 45 32.5829 45 32.5C45 26.7325 40.5713 22.0526 35.0898 22.002C35.0309 21.5095 35 21.0083 35 20.5M35 45C35 44.3168 34.9394 43.6471 34.8252 42.9951C29.6207 42.9014 25.3874 38.6361 25.0273 33.2451C24.2111 33.0842 23.3658 33 22.5 33M35 45C35 51.6274 29.4036 57 22.5 57C15.5964 57 10 51.6274 10 45C10 38.3726 15.5964 33 22.5 33M35 20.5C35 13.5964 29.4036 8 22.5 8C15.5964 8 10 13.5964 10 20.5C10 27.4036 15.5964 33 22.5 33M35 20.5C35 21.0084 34.9682 21.5095 34.9092 22.002C29.4282 22.0532 25 26.7328 25 32.5C25 32.5829 25.0031 32.6656 25.0049 32.748C24.1955 32.9127 23.358 33 22.5 33M28.0352 40.4435L22.6709 45.8078M27.501 25.1494L22.6787 20.3281M48.1543 20.3276L42.79 25.6918M48.1602 45.8084L42.7959 40.4442"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  aquarium: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      className={className}
    >
      <path
        d="M52.501 35V36.4583M46.6665 52.2967C42.8725 47.3291 40.8172 41.2517 40.8172 35.0009C40.8172 28.7501 42.8725 22.6728 46.6665 17.7051M20.4182 31.1208C20.4182 23.3333 16.2765 17.4125 7.96399 16.0417C5.04733 20.4167 5.04733 30.625 8.63482 35C5.01816 39.375 5.01816 49.5833 7.96399 53.9583C16.2765 52.5875 20.4182 46.6667 20.4182 38.8792M30.507 21.175C29.7487 17.15 26.7445 12.3667 23.332 8.75004H40.2487C41.6326 8.74491 42.9733 9.232 44.0312 10.1243C45.0891 11.0165 45.7953 12.2559 46.0237 13.6209L46.6945 17.7042M46.6945 52.2967L46.0237 56.3801C45.7953 57.7451 45.0891 58.9844 44.0312 59.8767C42.9733 60.769 41.6326 61.256 40.2487 61.2509H27.707C30.5328 58.0469 32.0799 53.9146 32.0529 49.6426M18.957 35C21.6987 24.9083 33.3654 17.5 43.7487 17.5C54.132 17.5 61.4237 24.9083 64.1654 35C61.4237 45.1208 54.132 52.5 43.7487 52.5C33.3654 52.5 21.6987 45.1208 18.957 35Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  landmark: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      className={className}
    >
      <path
        d="M11.6672 64.1668H58.3328M17.4993 55.5002V29.0834M29.1659 55.5002V29.0834M40.8326 55.5002V29.0834M52.4992 55.5002V29.0834M34.9993 5.8335L58.3326 20.4168H11.666L34.9993 5.8335Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default DestinationIcons;

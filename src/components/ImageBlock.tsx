// import React from "react";

// const ImageBlock = () => {
//   return (
//     <div
//       className="w-full"
//       style={{
//         height: "361px",
//         alignSelf: "stretch",
//         background: `url("/public/assets/Image.png") lightgray 0px -924.599px / 100% 478.67% no-repeat`,
//       }}
//     />
//   );
// };

// export default ImageBlock;
// import "./ImageBlock.css"; // سنستخدم CSS مخصص للزوايا

// const ImageBlock = () => {
//   return (
//     <div className="relative w-full h-[361px] overflow-hidden clip-custom">
//       <img
//         src="/public/assets/Image.png" // استبدل بالمسار الصحيح داخل public/assets/
//         alt="Living Room"
//         className="w-full h-full object-cover"
//       />
//     </div>
//   );
// };

// export default ImageBlock;
// import "./ImageBlock.css";

// const ImageBlock = () => {
//   return (
//     <div className="relative w-full h-[361px] overflow-hidden custom-clip">
//       <img
//         src="/public/assets/Image.png" // ← استبدل بالمسار الفعلي للصورة داخل مجلد public
//         alt="Living Room"
//         className="w-full h-full object-cover"
//       />
//     </div>
//   );
// };

// export default ImageBlock;
import React from "react";
import "../style/ImageBlock.css";

// const ImageBlock = () => {
//   return (
//     <div className="custom-image-block relative w-full h-[361px] overflow-hidden">
//       <img
//         src="/public/assets/Image.png" // ← تأكد أن الصورة موجودة داخل public/assets
//         alt="Living Room"
//         className="w-full h-full object-cover"
//       />
//     </div>
//   );
// };

// export default ImageBlock;
// const ImageBlock = () => {
//   return (
//     <div className="custom-image-block relative w-full h-[361px] overflow-hidden border-t-2 border-black border-b-2 border-white">
//       <img
//         src="/public/assets/Image.png"
//         alt="Living Room"
//         className="w-full h-full object-cover"
//       />
//     </div>
//   );
// };

// export default ImageBlock;
// const ImageBlock = () => {
//   return (
//     <div className="custom-image-block relative w-full h-[361px] overflow-hidden border-t-[1px] border-black border-b-[1px] border-white">
//       <img
//         src="/public/assets/Image.png"
//         alt="Living Room"
//         className="w-full h-full object-cover"
//       />
//     </div>
//   );
// };

// export default ImageBlock;

const ImageBlock = () => {
  return (
    <div className="custom-image-block relative w-full h-[361px] overflow-hidden">
      <img
        src={`https://${import.meta.env.VITE_BUCKET_CDN_URL}/image/website/reef-feel-luxury.png`}
        alt="Living Room"
        width={1920}
        height={361}
        className="h-full w-full object-cover max-sm:object-left"
      />
    </div>
  );
};

export default ImageBlock;

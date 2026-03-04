// import { useState } from "react";
// import { FaArrowUp } from 'react-icons/fa';
// import StatCard from "./card";

// const SocialLink = ({ name }: { name: string }) => {
//   const [hover, setHover] = useState(false);

//   return (
//     <li
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//       className="relative flex items-center h-[32px]"
//     >
//       <a
//         href="#"
//         className={`flex items-center text-[20px] font-medium leading-[24px] font-general transition-all duration-300 ${
//           hover ? "text-[#40C2CC]" : "text-[#0A181ACC]"
//         }`}
//       >
//         {/* جعل طول النص ثابت لضمان محاذاة السهم */}
//         <span className="text-[#0A181ACC]  w-[119px] h-[24px] gap-[4px]">{name}</span>
//       </a>

//       {/* السهم مثبت دائماً على اليمين */}
//       <span className="right-0 w-[24px] h-[24px] flex items-center justify-center transition-transform duration-300">
//         <FaArrowUp
//           className={`transform rotate-45 transition-all duration-300 ${
//             hover ? "text-[#40C2CC] translate-x-1" : "text-[#0A181ACC]"
//           }`}
//           size={14}
//         />
//       </span>
//     </li>
//   );
// };





// const Footer = () => {
//   return (
//     <footer className="flex flex-col items-start h-[954px]  w-[1728px] px-[184px] pb-[32px] pt-[128px] gap-[96px] bg-white text-gray-800">
//       {/* Newsletter */}
//       <div className="w-[1360px] h-[304px] flex justify-between flex-wrap gap-8">
      

//         {/* Navigation + Projects + Social */}
//         <div className="w-[535px] h-[304px]">
//           <div className="grid grid-cols-3 gap-[32px] ">
//             {/* Navigation */}
//             <div className="w-[178.33px] h-[264px] gap-[20px]">
//               <h4 className="text-[16px] p-3 font-medium leading-[20px] mb-2 text-[rgba(10,24,26,0.38)] font-general">
//                 Navigation
//               </h4>
//               <ul className="space-y-1 ">
//                 {["Home", "About", "Blogs", "News", "Contact", "FAQ"].map((item, index) => (
//                   <li key={index}>
//                     <a
//                       href="#"
//                       className=" w-[57px] h-[24px] relative inline-block ps-6 text-[20px] font-medium leading-[24px] text-[rgba(10,24,26,0.80)] font-general transition-all duration-300 hover:translate-x-2 hover:text-[#40C2CC]
//                       before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-[2px] before:bg-[#40C2CC] before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:w-6"
//                     >
//                       {item}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Projects */}
//             <div className="w-[178.33px] h-[144px] gap-[16px]">
//               <h4 className="text-[16px] p-3 font-medium leading-[20px] mb-2 text-[rgba(10,24,26,0.38)] font-general">
//                 Projects
//               </h4>
//               <ul className="space-y-1 gap-4">
//                 {["REEF 1000", "REEF 999", "REEF 998"].map((item, index) => (
//                   <li key={index}>
//                     <a
//                       href="#"
//                       className="block w-[120px] h-[24px] text-[20px] font-medium leading-[24px] text-[rgba(10,24,26,0.80)] font-general transition-transform duration-300 hover:translate-x-1 hover:text-[#40C2CC]"
//                     >
//                       {item}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Social */}
//             <div className="w-[178.33px] h-[304px] gap-[16px]">
//               <h4 className="text-[16px] p-3 font-medium leading-[20px] mb-2 text-[rgba(10,24,26,0.38)] font-general">
//                 Social
//               </h4>
//               <ul className="space-y-1 font-general">
//                 {[
//                   "Facebook ",
//                   "Instagram",
//                   "TikTok   ",
//                   "LinkedIn  ",
//                   "X(Twitter)",
//                   "Snapchat",
//                   "Youtube",
//                 ].map((item, index) => (
//                   <SocialLink key={index} name={item} />
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stat Cards Section */}
//       <div className="p-10 flex gap-6 flex-wrap">
//         <StatCard
//           number={90}
//           image="/assets/state.png"
//           label="CHANNEL PARTNER"
//           bgColor="#00C5CF"
//           textColor="#FFFFFF"
//           arrowIcon="/assets/arrow-icon.png"
//           hoverText="RECOME"
//           hoverText2="PARTNER"
//           hoverArrowIcon="/assets/arrow-icon.png"
//         />

//         <StatCard
//           number={150}
//           image="/assets/state2.png"
//           label="EMPLOYEE"
//           bgColor="#FFFFFF"
//           textColor="#2B3B3B"
//           arrowIcon="/assets/01.png"
//           hoverText="JOIN TO"
//           hoverText2="OUR TEAM"
//           hoverArrowIcon="/assets/01.png"
//         />
//       </div>

//       {/* Bottom Footer */}
//       <div className="w-full flex flex-col md:flex-row justify-between text-xs text-[#0A181A61] pt-4 font-general pb-[2rem]">
//         <div>© 2025 REEF LUXURY DEVELOPMENT. ALL RIGHTS RESERVED.</div>
//         <div className="space-x-4 mt-2 md:mt-0">
//           {["PRIVACY POLICY", "TERMS", "COOKIE POLICY", "SITEMAP"].map((item, i) => (
//             <a key={i} href="#" className="hover:text-[#40C2CC] transition text-[#0A181A61]">
//               {item}
//             </a>
//           ))}
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

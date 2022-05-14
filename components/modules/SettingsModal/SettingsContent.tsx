// import React from "react";
// import Toggle from "../../../Toggle";

// const buttons = [
//   {
//     name: "General",
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-5 w-5"
//         viewBox="0 0 20 20"
//         fill="currentColor"
//       >
//         <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
//       </svg>
//     ),
//     bg: "bg-violet-400",
//   },
// ];

// interface SettingsContentProps {
//   closeModal: () => void;
// }

// export default function SettingsContent({ closeModal }: SettingsContentProps) {
//   const saveSettings = () => {
//     closeModal();
//   };

//   return (
//     <div className="z-10 flex h-full w-full flex-col justify-between bg-primary-800 p-6 pt-12 pr-16 text-primary-50 shadow-xl">
//       <div className="flex flex-col gap-12">
//         <div>
//           <div className="mb-4 flex items-center gap-2">
//             <div className="rounded-lg bg-violet-400 p-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
//               </svg>
//             </div>
//             <h2 className="mb-1 text-2xl">General</h2>
//           </div>
//           <div className="grid grid-cols-2 gap-x-8 gap-y-2">
//             <TextInput placeholder="Search placeholder" />
//             <TextInput placeholder="Calendar url" />
//             <TextInput placeholder="Search url" />
//             <TextInput placeholder="Custom search url" />
//           </div>
//         </div>

//         <hr className="opacity-80" />

//         <div>
//           <div className="flex items-center gap-6">
//             <div className="mb-4 flex items-center gap-2">
//               <div className="rounded-lg bg-green-400 p-1">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
//                   />
//                 </svg>
//               </div>
//               <h2 className="mb-1 text-2xl">Weather</h2>
//             </div>
//             <div className="mb-2">
//               <Toggle />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-x-8 gap-y-2">
//             <TextInput placeholder="Api key" />
//             <TextInput placeholder="Location" />
//             <div className="flex flex-col gap-2">
//               <p>Detailed weather display</p>
//               <Toggle />
//             </div>
//           </div>
//         </div>

//         <hr className="opacity-80" />

//         <div>
//           <div className="flex w-1/2 items-center justify-between">
//             <div className="mb-4 flex items-center gap-2">
//               <div className="rounded-lg bg-sky-400 p-1">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <h2 className="mb-1 text-2xl">Providers</h2>
//             </div>
//             <div className="mr-4">
//               <TextInput placeholder="Search..." />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-x-8 gap-y-2">
//             <TextInput placeholder="Api key" />
//             <TextInput placeholder="Location" />
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end gap-4">
//         <ButtonInput state={State.success} onClick={saveSettings}>
//           Save
//         </ButtonInput>
//         <ButtonInput state={State.grey} onClick={closeModal}>
//           Exit
//         </ButtonInput>
//       </div>
//     </div>
//   );
// }

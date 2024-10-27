// import React, { createContext, useState, useContext, useEffect, ReactNode } from "react"; // Import React
// import { useUser } from "./UserContext";
// import { getAllMP4s } from "../utils/mp4DB";

// // Define the shape of the MP4 context value
// interface MP4ContextType {
//   mp4List: any[]; // You can replace 'any' with a more specific type if available
//   setMP4List: React.Dispatch<React.SetStateAction<any[]>>; // You can replace 'any' with a more specific type if available
// }

// // Create a context with a default value
// const MP4Context = createContext<MP4ContextType | undefined>(undefined);

// interface MP4ProviderProps {
//   children: ReactNode;
// }

// export const MP4Provider: React.FC<MP4ProviderProps> = ({ children }) => {
//   const [mp4List, setMP4List] = useState<any[]>([]); // You can replace 'any' with a more specific type if available
//   const { loadingUser, isLoggedIn,authUser } = useUser();

//   useEffect(() => {
//     const fetchMP4s = async () => {
//       if (!loadingUser && isLoggedIn) {
//         const mp4List = await getAllMP4s(authUser);
//         setMP4List(mp4List)
//       }
//     };
//     fetchMP4s();
//   }, [loadingUser, isLoggedIn]);

//   return (
//     <MP4Context.Provider
//       value={{
//         mp4List,
//         setMP4List,
//       }}>
//       {children}
//     </MP4Context.Provider>
//   );
// };

// // Create a custom hook to use the MP4Context
// export const useMP4 = (): MP4ContextType => {
//   const context = useContext(MP4Context);
//   if (!context) {
//     throw new Error("useMP4 must be used within an MP4Provider");
//   }
//   return context;
// };

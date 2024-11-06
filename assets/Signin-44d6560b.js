import{r as a,U as y,q as j,j as e,I as r,B as v,L as w}from"./index-67363a7f.js";import{s as N}from"./firebaseAuth-274308f9.js";import{g as E}from"./ConvertErrorMsg-076c80b9.js";const k=()=>{const{loadingUser:m,isLoggedIn:x}=a.useContext(y),s=j(),[l,g]=a.useState(""),[o,p]=a.useState(""),[n,h]=a.useState(""),[i,d]=a.useState(""),[c,u]=a.useState(!1);!m&&!x&&s("/YouTube-Converter/account");const b=async t=>{t.preventDefault(),u(!0),d("");try{await N(o,n,l),alert("Verification email sent! Please check your inbox."),s("/YouTube-Converter/login")}catch(C){const f=E(C.message);d(f)}finally{u(!1)}};return e.jsx("div",{className:"min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E] transition-all duration-300 px-4",children:e.jsxs("div",{className:"w-full max-w-md p-8 bg-[#2C2C2C] border border-[#4CAF50] rounded-lg shadow-lg",children:[e.jsx("h2",{className:"text-2xl text-center font-bold mb-8 text-white",children:"Sign up"}),i&&e.jsx("p",{className:"mb-6 text-center text-red-400",children:i}),e.jsxs("form",{onSubmit:b,className:"flex flex-col space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"name",className:"block mb-2 text-sm text-gray-400",children:"Name*"}),e.jsx(r,{type:"text",id:"name",value:l,onChange:t=>g(t.target.value),className:"w-full p-2 border rounded-lg border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50]",placeholder:"Enter your display name",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"block mb-2 text-sm text-gray-400",children:"Email*"}),e.jsx(r,{type:"email",id:"email",value:o,onChange:t=>p(t.target.value),className:"w-full p-2 border rounded-lg border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50]",placeholder:"Enter your email",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"block mb-2 text-sm text-gray-400",children:"Password*"}),e.jsx(r,{type:"password",id:"password",password:!0,value:n,onChange:t=>h(t.target.value),className:"w-full p-2 border rounded-lg border-[#4CAF50] bg-[#333] text-[#4CAF50] placeholder-[#4CAF50]",placeholder:"Enter your password",required:!0})]}),e.jsx(v,{aria_label:"Sign up",children:c?"Signing up...":"Sign up",type:"submit",className:"mt-4 w-full py-3 text-white bg-[#4CAF50] hover:bg-[#388E3C] rounded-lg transition duration-300",disabled:c})]}),e.jsxs("p",{className:"mt-6 text-center text-gray-300",children:["Already have an account?"," ",e.jsx(w,{to:"/YouTube-Converter/login",className:"text-[#4CAF50] hover:text-[#388E3C] underline transition duration-200",children:"Log in"})]})]})})};export{k as default};
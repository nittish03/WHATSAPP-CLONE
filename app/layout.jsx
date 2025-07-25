import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { AppWrapper } from "@/context/index";

export const metadata = {
  title: 'Student Skill Development Portal',
  description: 'A comprehensive platform for skill development and learning',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-white text-black  font-inter">
        <SessionWrapper>
          <AppWrapper>
            <Toaster
             position="top-right"
            />
            {/* <div className=" pb-10 min-h-screen"> */}
            <main>{children}</main>
            {/* </div> */}
          </AppWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
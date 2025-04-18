"use client"; // Mark this as a Client Component

import { ThemeToggle } from "@/components/theme-toggle";
import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the Mail component with SSR disabled
const Mail = dynamic(() => import("./mail"), {
  ssr: false, // Ensures the component is only rendered on the client side
});

const MailDashboard = () => {
  return (
    <>
      <Mail defaultLayout={[40, 60]} />
    </>
  );
};

export default MailDashboard;

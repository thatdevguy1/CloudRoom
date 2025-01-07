import Footer from "@/components/footer/Footer";
import React from "react";

interface DynamicPageProps {
  children: React.ReactElement;
}

function DynamicPage({ children }: DynamicPageProps) {
  return (
    <div className="h-full">
      {children}
      <Footer />
    </div>
  );
}

export default DynamicPage;

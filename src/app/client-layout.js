"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import SplashScreen from "@/components/SplashScreen";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Toaster } from "@/components/ui/sonner";

export function ClientLayout({ children }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <div className="App min-h-screen bg-[#050505]">
          <SplashScreen show={showSplash} />
          
          {!showSplash && (
            <>
              <Header />
              
              <main>
                {children}
              </main>
              
              <Footer />
              
              <AuthModal />
              
              <Toaster position="top-right" />
            </>
          )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

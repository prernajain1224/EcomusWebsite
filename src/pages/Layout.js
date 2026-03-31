import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopBanner from "../components/TopBanner";
import SearchDrawer from "../components/SearchDrawer";
import MobileMenu from "../components/MobileMenu";

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <TopBanner />
      <Header
        onSearchOpen={() => setSearchOpen(true)}
        onMobileMenuOpen={() => setMobileMenuOpen(true)}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}

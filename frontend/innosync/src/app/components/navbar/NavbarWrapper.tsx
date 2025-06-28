"use client";
import { usePathname } from "next/navigation";
import Navbar from "./page";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/authentication/login") || pathname.startsWith("/authentication/signup");
  if (hideNavbar) return null;
  return <Navbar />;
}
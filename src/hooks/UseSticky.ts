"use client";
import { useEffect, useState } from "react";

interface StickyState {
  sticky: boolean;
}

const UseSticky = (): StickyState => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const stickyHeader = () => setSticky(window.scrollY > 80);

    stickyHeader();
    window.addEventListener("scroll", stickyHeader);
    return () => window.removeEventListener("scroll", stickyHeader);
  }, []);

  return { sticky };
};

export default UseSticky;

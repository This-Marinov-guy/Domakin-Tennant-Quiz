"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import UseSticky from "@/hooks/UseSticky";

import logo from "@/assets/img/logo-2.png";

const nav_links = [
  { title: "About", link: "/about" },
  { title: "Contact", link: "/contact" },
];

const HeaderOne = () => {
  const { sticky } = UseSticky();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`theme-main-menu menu-overlay menu-style-one sticky-menu ${
        sticky ? "fixed" : ""
      }`}
    >
      <div className="inner-content px-10">
        <div className="top-header position-relative">
          <div className="d-flex align-items-center justify-content-between">
            <div className="logo order-lg-0">
              <Link href="/" className="mt-5 d-flex align-items-center" scroll={false}>
                <Image className="round-logo" src={logo} alt="Domakin" />
              </Link>
            </div>
            <nav className="navbar navbar-expand-lg p0 order-lg-2 ms-auto">
              <button
                className="navbar-toggler d-block d-lg-none"
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-controls="navbarNav"
                aria-expanded={open}
                aria-label="Toggle navigation"
              >
                <span></span>
              </button>
              <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="navbarNav">
                <ul className="navbar-nav align-items-lg-center">
                  {nav_links.map((item) => (
                    <li key={item.link} className="nav-item">
                      <Link
                        href={item.link}
                        className={`nav-link ${pathname === item.link ? "active" : ""}`}
                        onClick={() => setOpen(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderOne;

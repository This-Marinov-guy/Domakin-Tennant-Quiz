import Image from "next/image";
import Link from "next/link";

import footerLogo from "@/assets/img/logo-transparent.png";
import footerShape from "@/assets/images/assets/ils_06.svg";

const EMAIL = "info@domakin.nl";
const FACEBOOK = "https://www.facebook.com/profile.php?id=100093230497851";
const INSTAGRAM = "https://www.instagram.com/domakin.nl/";
const LINKEDIN = "https://www.linkedin.com/company/domakin/";
const KVK = "90831268";

const FooterFour = () => {
  return (
    <div className="footer-four position-relative z-1">
      <div className="container container-large">
        <div className="bg-wrapper position-relative z-1">
          <div className="row">
            <div className="col-xxl-3 col-lg-4 mb-60">
              <div className="footer-intro">
                <div className="logo mb-20">
                  <Link href="/">
                    <Image className="logo" src={footerLogo} alt="Domakin" />
                  </Link>
                </div>
                <a
                  href={`mailto:${EMAIL}`}
                  target="_blank"
                  className="email tran3s mb-60 md-mb-30"
                >
                  {EMAIL}
                </a>
                <ul className="style-none d-flex align-items-center social-icon">
                  <li>
                    <a href={FACEBOOK} target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href={INSTAGRAM} target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href={LINKEDIN} target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-6 mb-30">
              <div className="footer-nav">
                <h5 className="footer-title">Support</h5>
                <ul className="footer-nav-link style-none">
                  <li>
                    <Link href="/terms&policy">Terms &amp; Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-footer">
          <p className="m0 text-center fs-16">KVK: {KVK}</p>
          <p className="m0 text-center fs-16" suppressHydrationWarning>
            All rights reserved {new Date().getFullYear()}
          </p>
        </div>
      </div>
      <Image src={footerShape} alt="" className="lazy-img shapes shape_01" />
    </div>
  );
};

export default FooterFour;

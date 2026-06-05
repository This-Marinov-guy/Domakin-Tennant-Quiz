"use client";
import Link from "next/link";
import { useState } from "react";

const EMAIL = "info@domakin.nl";
const PHONE_NUMBER = "+31 85 083 5000";
const INSTAGRAM = "https://www.instagram.com/domakin.nl/";
const LINKEDIN = "https://www.linkedin.com/company/domakin/";

interface ContactInfo {
  id: number;
  icon: string;
  title: string;
  value: string;
  link: string;
}

const contact_info: ContactInfo[] = [
  {
    id: 1,
    icon: "fa-solid fa-envelope",
    title: "E-mail",
    value: EMAIL,
    link: "mailto:" + EMAIL,
  },
  {
    id: 2,
    icon: "fa-solid fa-phone",
    title: "Telephone",
    value: PHONE_NUMBER,
    link: "tel:" + PHONE_NUMBER.replace(/\s/g, ""),
  },
  {
    id: 3,
    icon: "fa-brands fa-instagram",
    title: "Instagram",
    value: "domakin.nl",
    link: INSTAGRAM,
  },
  {
    id: 4,
    icon: "fa-brands fa-linkedin",
    title: "LinkedIn",
    value: "Domakin",
    link: LINKEDIN,
  },
];

const ContactArea = () => {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `From: ${email}\n\n${message}`;
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <div style={{ width: "97vw" }} className="contact-us border-top pt-60">
      <div className="address-banner wow fadeInUp mt-60 lg-mt-40">
        <div className="row d-flex justify-content-center">
          {contact_info.map((item) => (
            <Link
              href={item.link}
              target="_blank"
              key={item.id}
              className="col-lg-2 col-md-3 col-6 mt-10 hover-blue"
            >
              <div className="d-xl-flex align-items-center">
                <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                  <i
                    style={{ color: "white", fontSize: "1.8em" }}
                    className={item.icon}
                  />
                </div>
                <div className="text">
                  <p className="fs-22">{item.title}</p>
                  <p className="tran3s">{item.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-pink mt-60">
        <div className="row">
          <div className="col-xl-7 col-lg-6">
            <div className="form-style-one wow fadeInUp">
              <form onSubmit={handleSubmit}>
                <h3>Contact us directly</h3>
                <div className="messages"></div>
                <div className="row controls">
                  <div className="col-12">
                    <div className="input-group-meta form-group mb-30">
                      <label>Enter the subject</label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="Enter the subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="input-group-meta form-group mb-40">
                      <label>Enter your email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="input-group-meta form-group mb-35">
                      <textarea
                        name="message"
                        placeholder="Enter your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn-nine text-uppercase rounded-3 fw-normal w-100"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-xl-5 col-lg-6 d-flex order-lg-first">
            <div className="d-flex align-items-center justify-content-center contact-map-banner w-100">
              <img
                src="/assets/img/logo-transparent.png"
                width={200}
                height={200}
                alt="Domakin"
                className="lazy-img logo rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactArea;

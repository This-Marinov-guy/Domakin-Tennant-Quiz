import Image from "next/image";
import Link from "next/link";

import errorImg from "@/assets/images/assets/ils_08.svg";

const ErrorArea = () => {
  return (
    <div className="error-section position-relative z-1 bg-pink">
      <div className="container">
        <div className="row">
          <div className="col-xxl-8 col-xl-6 col-lg-7 col-md-8 m-auto">
            <div className="title-one text-center mb-75 lg-mb-20 wow fadeInUp">
              <h3>
                Page <span>not found</span>
              </h3>
              <p className="fs-20 pb-45">
                The page you are looking for does not exist
              </p>
              <Link href="/" className="btn-five sm fw-normal text-uppercase">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Image
        src={errorImg}
        alt=""
        className="lazy-img w-100 position-absolute bottom-0 start-0 z-n1"
      />
    </div>
  );
};

export default ErrorArea;

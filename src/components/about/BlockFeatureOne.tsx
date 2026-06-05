const BlockFeatureOne = () => {
  return (
    <div className="block-feature-two mt-40 mb-40">
      <div className="container">
        <div className="row gx-xl-5">
          <div className="col-lg-6 wow fadeInLeft">
            <div className="me-xxl-4">
              <div className="title-one lg-mb-40">
                <div className="upper-title">About us</div>
                <h4>Helping you find a place</h4>
              </div>
              <img src="/assets/img/gallery/map.png" alt="About Domakin" />
            </div>
          </div>

          <div className="col-lg-6 wow fadeInRight">
            <div className="block-two md-mt-40">
              <div className="bg-wrapper">
                <p>
                  In 2023, the team of Domakin came together to address an issue
                  many students like them face during their journey in the
                  Netherlands - finding housing. Some of the founders of Domakin
                  had already established a student organization across the
                  country. After speaking to students, agencies, and parents, it
                  became clear that the biggest challenge for international
                  students in the Netherlands remains finding housing. Thus,
                  Domakin was founded with a mission to make this process easier
                  for as many students as possible.
                </p>
                <p className="mt-20">
                  As a team who has experienced these challenges first-hand
                  during our studies in the Netherlands, we are here to assist
                  you in finding your new home:
                </p>
                <ul style={{ padding: "0" }} className="no-dots">
                  <li className="d-flex align-items-center gap-3">
                    <i className="icon-blue fa-solid fa-users-viewfinder" />
                    If you are looking for accommodation in the Netherlands, we
                    are here to help you!
                  </li>
                  <br />
                  <li className="d-flex align-items-center gap-3">
                    <i className="icon-blue fa-solid fa-magnifying-glass-location" />
                    If you are currently located abroad and are unable to attend
                    a viewing, we are here to represent you at a viewing!
                  </li>
                  <br />
                  <li className="d-flex align-items-center gap-3">
                    <i className="icon-blue fa-solid fa-people-arrows" />
                    If you are leaving your room or searching for a flatmate and
                    want to help another student find housing, we offer a
                    platform to list your room!
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockFeatureOne;

const NotFound = () => {
  return (
    <section className="page-404-wrap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="image">
              <img
                src="/assets/images/404.png"
                alt=""
                style={{ maxWidth: 320 }}
              />
            </div>
            <div className="title">Oops...That link is broken.</div>
            <p>
              Sorry for the inconvenience. Go to our homepage to check out our
              latest collections.
            </p>
            <a
              href="/"
              className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;

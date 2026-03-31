import React from "react";

const ProductTitle = () => {
  return (
    <div className="tf-breadcrumb">
      <div className="container">
        <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">

          {/* LEFT SIDE */}
          <div className="tf-breadcrumb-list">
            <a href="/" className="text">Home</a>
            <i className="icon icon-arrow-right"></i>

            <a href="#" className="text">Women</a>
            <i className="icon icon-arrow-right"></i>

            <span className="text">Cotton jersey top</span>
          </div>

          {/* RIGHT SIDE */}
          <div className="tf-breadcrumb-prev-next">
            <a href="#" className="tf-breadcrumb-prev">
             <i class="icon icon-arrow-left"></i>
            </a>

            <a href="#" className="tf-breadcrumb-back">
                <i class="icon icon-shop"></i>
            </a>

            <a href="#" className="tf-breadcrumb-next">
              <i class="icon icon-arrow-right"></i>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductTitle;
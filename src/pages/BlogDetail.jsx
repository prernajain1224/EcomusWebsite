import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageTitle } from "../components/PageTitle";
import { getBlogDetails } from "../api/blogs";
import { getImageUrl } from "../api/utils";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlogDetails(slug)
      .then((res) => setBlog(res?.blog || res))
      .catch((e) => console.error("Failed to load blog", e))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Loading Skeleton ──
  if (loading) {
    return (
      <div className="blog-detail">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="blog-detail-main">
                {/* Title skeleton */}
                <div
                  style={{
                    background: "#f4f3ef",
                    height: 28,
                    width: "60%",
                    margin: "0 auto 16px",
                    animation: "pulse 1.4s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    background: "#f4f3ef",
                    height: 18,
                    width: "30%",
                    margin: "0 auto 24px",
                    animation: "pulse 1.4s ease-in-out infinite",
                  }}
                />
                {/* Banner skeleton */}
                <div
                  style={{
                    background: "#f4f3ef",
                    height: 400,
                    marginBottom: 24,
                    animation: "pulse 1.4s ease-in-out infinite",
                  }}
                />
                {/* Content skeleton lines */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#f4f3ef",
                      height: 14,
                      width: i % 2 === 0 ? "100%" : "80%",
                      marginBottom: 10,
                      animation: "pulse 1.4s ease-in-out infinite",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Not Found ──
  if (!blog) {
    return (
      <div className="blog-detail">
        <div className="container">
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "#888", fontSize: 16, marginBottom: 16 }}>
              Blog not found. 😕
            </p>
            <Link to="/blogs" className="tf-btn btn-fill animate-hover-btn">
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Format Date ──
  const formattedDate = blog.posted_at
    ? new Date(blog.posted_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // ── Share URLs ──
  const pageUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(blog.title);

  return (
    <>
      {/* Page Banner */}
      <PageTitle
        title={blog.title}
        subtitle={`Published ${formattedDate}`}
        bgImage={
          blog.banner_image ? getImageUrl(blog.banner_image) : "blogBanner.png"
        }
      />

      <div className="blog-detail">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="blog-detail-main">
                {/* ── Heading Section ── */}

                {/* ── Blog Content (Trix HTML) ── */}
                <div
                  className="desc trix-content mt_30 fs-18"
                  style={{ lineHeight: 1.5 }}
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* ── Bottom: Tags + Share ── */}
                <div className="bot d-flex justify-content-between flex-wrap align-items-center">
                  {/* Tag */}
                  {blog.category && (
                    <ul className="tags-lists">
                      <li>
                        <span className="tags-item">
                          <span>{blog.category}</span>
                        </span>
                      </li>
                    </ul>
                  )}

                  {/* Social Share */}
                  <div className="d-flex align-items-center gap-20">
                    <p>Share:</p>
                    <ul className="tf-social-icon d-flex style-default">
                      <li>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="box-icon round social-facebook border-line-black"
                        >
                          <i className="icon fs-14 icon-fb" />
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareTitle}`}
                          target="_blank"
                          rel="noreferrer"
                          className="box-icon round social-twiter border-line-black"
                        >
                          <i className="icon fs-12 icon-Icon-x" />
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://www.instagram.com/`}
                          target="_blank"
                          rel="noreferrer"
                          className="box-icon round social-instagram border-line-black"
                        >
                          <i className="icon fs-14 icon-instagram" />
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://www.pinterest.com/pin/create/button/?url=${pageUrl}&description=${shareTitle}`}
                          target="_blank"
                          rel="noreferrer"
                          className="box-icon round social-pinterest border-line-black"
                        >
                          <i className="icon fs-14 icon-pinterest-1" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* ── Back to Blogs ── */}
                <div style={{ textAlign: "center", padding: "32px 0 0" }}>
                  <Link to="/blogs" className="tf-btn btn-line fw-6">
                    ← Back to Blogs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trix Content Styles ── */}
      <style>{`
        .trix-content h1, .trix-content h2, .trix-content h3 { color: #2c3a34; margin: 24px 0 12px; }
        .trix-content p { margin-bottom: 16px; }
        .trix-content ul, .trix-content ol { padding-left: 24px; margin-bottom: 16px; }
        .trix-content li { margin-bottom: 6px; }
        .trix-content img { max-width: 100%; height: auto; margin: 16px 0; }
        .trix-content blockquote { border-left: 4px solid #2c3a34; padding-left: 16px; color: #555; margin: 20px 0; font-style: italic; }
        .trix-content a { color: #2c3a34; font-weight: 600; }
        .trix-content pre { background: #f4f3ef; padding: 16px; overflow-x: auto; font-size: 13px; }
        .trix-content div { margin-top: 0; margin-bottom: 0; }
      `}</style>
    </>
  );
};

export default BlogDetail;

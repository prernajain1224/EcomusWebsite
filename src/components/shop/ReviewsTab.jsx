import { useState } from "react";
import { createReview } from "../../api/reviews";
import { showErrorMessage, showSuccessMessage, OK } from "../../utils";

/**
 * ReviewsTab — same design as new theme
 * Props:
 * - reviews: array
 * - reviewsCount: number
 * - productSlug: string
 * - onReviewSubmitted: function(newReview)
 */
const ReviewsTab = ({
  reviews = [],
  reviewsCount = 0,
  productSlug,
  onReviewSubmitted,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Computed rating breakdown ──────────────────────────────
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter(
      (r) => Math.round(Number(r.rating)) === star,
    ).length;
    const pct =
      reviews.length > 0 ? ((count / reviews.length) * 100).toFixed(1) : "0";
    return { star, count, pct };
  });

  // ── Time ago helper ────────────────────────────────────────
  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} days ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ── Submit review ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showErrorMessage("Review comment is required");
      return;
    }
    if (!rating) {
      showErrorMessage("Please select a rating");
      return;
    }
    try {
      setSubmitting(true);
      const res = await createReview(productSlug, { rating, title, comment });
      if (res?.status !== OK)
        throw res?.error || res?.message || "Failed to submit review";
      showSuccessMessage("Review submitted successfully! 🌈");
      onReviewSubmitted?.(
        res?.review || {
          rating,
          title,
          body: comment,
          created_at: new Date().toISOString(),
        },
      );
      setShowForm(false);
      setRating(5);
      setTitle("");
      setComment("");
    } catch (err) {
      showErrorMessage(
        typeof err === "string" ? err : "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tab-reviews write-cancel-review-wrap">
      {/* ── Ratings Summary ── */}
      <div className="tab-reviews-heading">
        <div className="top">
          {/* Average score */}
          <div className="text-center">
            <h1 className="number fw-6">{avgRating}</h1>
            <div className="list-star">
              {[1, 2, 3, 4, 5].map((s) => (
                <i
                  key={s}
                  className={`icon icon-star${s <= Math.round(Number(avgRating)) ? "" : "-empty"}`}
                />
              ))}
            </div>
            <p>({reviewsCount} Ratings)</p>
          </div>

          {/* Star breakdown */}
          <div className="rating-score">
            {ratingBreakdown.map(({ star, count, pct }) => (
              <div key={star} className="item">
                <div className="number-1 text-caption-1">{star}</div>
                <i className="icon icon-star" />
                <div className="line-bg">
                  <div style={{ width: `${pct}%` }} />
                </div>
                <div className="number-2 text-caption-1">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Write / Cancel review buttons */}
        <div>
          {showForm ? (
            <div
              className="tf-btn btn-outline-dark fw-6 btn-comment-review"
              onClick={() => setShowForm(false)}
              style={{ cursor: "pointer" }}
            >
              Cancel Review
            </div>
          ) : (
            <div
              className="tf-btn btn-outline-dark fw-6 btn-comment-review"
              onClick={() => setShowForm(true)}
              style={{ cursor: "pointer" }}
            >
              Write a review
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews List ── */}
      {!showForm && (
        <div className="reply-comment cancel-review-wrap">
          <div className="d-flex mb_24 gap-20 align-items-center justify-content-between flex-wrap">
            <h5>
              {reviewsCount} Comment{reviewsCount !== 1 ? "s" : ""}
            </h5>
          </div>

          {reviews.length === 0 && (
            <p style={{ color: "#888", fontSize: 14 }}>
              No reviews yet. Be the first to review this product! 🌈
            </p>
          )}

          <div className="reply-comment-wrap">
            {reviews.map((review, i) => (
              <div key={review.id || i} className="reply-comment-item">
                <div className="user">
                  {/* Avatar initials */}
                  <div
                    className="image"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: "#2c3a34",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {(review.customer_name ||
                      review.name ||
                      "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <h6>
                      <a href="#" className="link">
                        {review.title || review.headline || "Review"}
                      </a>
                    </h6>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {/* Star rating */}
                      <div style={{ display: "flex", gap: 2 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: 12,
                              color:
                                s <= Number(review.rating) ? "#f5a623" : "#ddd",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {/* Verified badge */}
                      {review.is_verified_purchase && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#2e7d32",
                            backgroundColor: "#e8f5e9",
                            padding: "1px 6px",
                            textTransform: "uppercase",
                            letterSpacing: 0.3,
                          }}
                        >
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="day text_black-2">
                      {review.customer_name || review.name || "Anonymous"}{" "}
                      &nbsp;·&nbsp;
                      {timeAgo(review.created_at || review.date)}
                    </div>
                  </div>
                </div>
                <p className="text_black-2">
                  {review.body || review.comment || review.review || ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Write Review Form ── */}
      {showForm && (
        <form
          className="form-write-review write-review-wrap"
          onSubmit={handleSubmit}
        >
          <div className="heading">
            <h5>Write a review:</h5>
            {/* Star rating picker */}
            <div className="list-rating-check">
              {[5, 4, 3, 2, 1].map((star) => (
                <span key={star}>
                  <input
                    type="radio"
                    id={`star${star}`}
                    name="rate"
                    value={star}
                    checked={rating === star}
                    onChange={() => setRating(star)}
                  />
                  <label htmlFor={`star${star}`} title={`${star} star`} />
                </span>
              ))}
            </div>
          </div>

          <div className="form-content">
            <fieldset className="box-field">
              <label className="label">Review Title</label>
              <input
                type="text"
                placeholder="Give your review a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                tabIndex={2}
              />
            </fieldset>

            <fieldset className="box-field">
              <label className="label">Review *</label>
              <textarea
                rows={4}
                placeholder="Write your comment here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                tabIndex={2}
                required
              />
            </fieldset>
          </div>

          <div className="button-submit">
            <button
              className="tf-btn btn-fill animate-hover-btn"
              type="submit"
              disabled={submitting}
              style={{
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Submit Reviews"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewsTab;

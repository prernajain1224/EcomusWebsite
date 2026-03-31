export default function Loading() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "#fff",
        border: "1px solid #dbe4de",
        padding: 28,
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <img
        src="/assets/images/loading.png"
        alt="Loading..."
        style={{ width: "100%", maxWidth: 320, marginBottom: 24 }}
      />
      <h2 style={{ margin: "0 0 10px", color: "#2c3a34" }}>Just a moment...</h2>
      <p style={{ margin: 0, color: "#5f6b65", fontSize: 14 }}>
        We're getting things ready for you!
      </p>
    </div>
  );
}

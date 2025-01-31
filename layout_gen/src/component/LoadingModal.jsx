import "../design/LoadingModal.css";

export default function LoadingModal({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="loadingModal">
      <div className="loadingAnimation">
        <div className="spinner"></div>
        <p>Loading images...</p>
      </div>
    </div>
  );
}

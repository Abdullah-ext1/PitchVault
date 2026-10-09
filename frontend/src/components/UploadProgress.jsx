const UploadProgress = ({ progress }) => {
  if (progress === 0 || progress === 100) return null;

  return (
    <div className="card" style={{ padding: "16px", marginTop: "12px" }}>
      <div className="progress">
        <i style={{ width: `${progress}%` }} />
      </div>
      <div className="small muted" style={{ marginTop: "6px" }}>
        {progress < 100
          ? `Uploading ${Math.round(progress)}%`
          : "Processing video..."}
      </div>
    </div>
  );
};

export default UploadProgress;

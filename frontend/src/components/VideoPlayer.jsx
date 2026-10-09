const VideoPlayer = ({ videoUrl, title }) => {
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        background: "var(--inset)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <video
        controls
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "#000",
        }}
        src={videoUrl}
        title={title}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;

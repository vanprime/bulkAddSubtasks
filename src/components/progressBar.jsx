const ProgressBar = ({ max, value, onComplete, error = null }) => {
  const scale = max > 0 ? value / max : 0;

  function handleTransitionEnd(e) {
    if (parseInt(value) === parseInt(max)) {
      onComplete(e);
    }
  }

  return (
    <div className="w-full h-2 bg-muted relative rounded overflow-hidden">
      <div
        className="bg-accent h-full rounded"
        style={{
          transform: `${error ? "scaleX(1)" : `scaleX(${scale})`}`,
          transformOrigin: "left",
          transition: "transform 0.33s ease-out",
          backgroundColor: `${error ? "tomato" : ""}`
        }}
        onTransitionEnd={(e) => handleTransitionEnd(e)}
      />
    </div>
  );
};

export default ProgressBar;

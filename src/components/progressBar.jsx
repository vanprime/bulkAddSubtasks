const ProgressBar = ({ max, value, onComplete }) => {
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
          transform: `scaleX(${scale})`,
          transformOrigin: "left",
          transition: "transform 0.25s ease-out", // Adjust the transition timing to your preference
        }}
        onTransitionEnd={(e) => handleTransitionEnd(e)}
      />
    </div>
  );
};

export default ProgressBar;

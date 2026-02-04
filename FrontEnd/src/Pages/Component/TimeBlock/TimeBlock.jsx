import React from "react";

const TimeBlock = React.memo(({ value, label }) => (
  <div>
    <strong>{value}</strong>
    <span className="subHeading fs-6">{label}</span>
  </div>
));

export default TimeBlock;
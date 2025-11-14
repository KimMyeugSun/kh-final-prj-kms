import React from 'react';

function SectionTitle({ children }) {
  return (
    <h2
      style={{ textAlign: 'center', fontWeight: 800, fontSize: 36, margin: 0 }}
    >
      {children}
    </h2>
  );
}

export default SectionTitle;
export { SectionTitle };

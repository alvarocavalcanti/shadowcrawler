import React from 'react';

const OBRLoading: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-theme-card rounded-lg border border-theme p-4">
        <h2 className="text-xl font-semibold mb-2 text-theme">Loading...</h2>
        <p className="text-theme-secondary">
          Please wait while Owlbear Rodeo loads.
        </p>
      </div>
    </div>
  );
};

export default OBRLoading;
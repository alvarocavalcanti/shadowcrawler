import React from "react";

const SceneNotReady: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-theme-card rounded-lg border border-theme p-4 mb-4 mt-4">
        <h2 className="text-xl font-semibold mb-2 text-theme">No Active Scene</h2>
        <p className="text-theme-secondary">
          In order to use the Shadow Crawler toolset you must have an active
          Scene.
        </p>
      </div>
    </div>
  );
};

export default SceneNotReady;

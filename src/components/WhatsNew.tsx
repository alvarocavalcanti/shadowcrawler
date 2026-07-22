import React, { useEffect, useState } from 'react';
import { releaseHighlights, changelogUrl } from '../releaseNotes';
import DonationButtons from './DonationButtons';

interface WhatsNewProps {
  currentVersion: string;
  storageKey: string;
}

const WhatsNew: React.FC<WhatsNewProps> = ({ currentVersion, storageKey }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (currentVersion === "unknown") return;

    const lastSeenVersion = localStorage.getItem(storageKey);

    if (lastSeenVersion !== currentVersion) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [currentVersion, storageKey]);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, currentVersion);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const recentReleases = releaseHighlights.slice(0, 2);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-theme-card rounded-lg border-2 border-theme max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-theme">
              🎉 What's New
            </h2>
            <button
              onClick={handleDismiss}
              className="text-theme-secondary hover:text-theme text-2xl leading-none"
              title="Close"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {recentReleases.map((release, index) => (
              <div key={release.version}>
                <div className="flex items-baseline gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-theme">
                    Version {release.version}
                  </h3>
                  <span className="text-sm text-theme-secondary">
                    {release.date}
                  </span>
                  {index === 0 && (
                    <span className="text-xs bg-theme-primary text-white px-2 py-0.5 rounded font-medium">
                      NEW
                    </span>
                  )}
                </div>
                <ul className="list-disc pl-5 space-y-2 mb-4 text-theme-secondary">
                  {release.highlights.map((highlight, i) => (
                    <li key={i}>
                      {highlight}
                    </li>
                  ))}
                </ul>
                {index < recentReleases.length - 1 && (
                  <div className="border-t border-theme my-4"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-theme">
            <a
              href={changelogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-primary hover:underline text-sm"
            >
              View full changelog on GitHub →
            </a>
          </div>

          <div className="mt-4 pt-4 border-t border-theme">
            <p className="text-center text-sm text-theme-secondary mb-2">
              Enjoying the extension? Consider supporting development:
            </p>
            <DonationButtons />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDismiss}
              className="px-6 py-2 bg-theme-primary border-2 border-theme-primary text-white rounded font-medium transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsNew;

import React from 'react';
import { themes, ThemeId } from '../themes';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="bg-theme-card rounded-lg border border-theme p-4 mb-3">
      <h2 className="text-lg font-semibold mb-3 text-theme">Color Theme</h2>
      <p className="text-theme-secondary mb-3 text-sm">
        Choose your preferred color scheme for a personalized experience:
      </p>
      <div className="grid grid-cols-1 gap-2">
        {(Object.keys(themes) as ThemeId[]).map((themeId) => {
          const theme = themes[themeId];
          return (
            <button
              key={themeId}
              onClick={() => onThemeChange(themeId)}
              className={`p-3 rounded border-2 text-left transition-all ${
                currentTheme === themeId
                  ? 'border-theme-primary'
                  : 'border-theme hover:border-theme-primary'
              }`}
            >
              <div className="font-semibold text-theme mb-1">
                {theme.name}
                {currentTheme === themeId && (
                  <span className="ml-2 text-xs bg-theme-primary text-white px-2 py-0.5 rounded">Active</span>
                )}
              </div>
              <div className="text-sm text-theme-secondary">{theme.description}</div>
              <div className="flex gap-1 mt-2">
                <div
                  className="w-6 h-6 rounded border border-theme"
                  style={{ backgroundColor: theme.light.primary }}
                  title="Primary"
                />
                <div
                  className="w-6 h-6 rounded border border-theme"
                  style={{ backgroundColor: theme.light.accent }}
                  title="Accent"
                />
                <div
                  className="w-6 h-6 rounded border border-theme"
                  style={{ backgroundColor: theme.light.success }}
                  title="Success"
                />
                <div
                  className="w-6 h-6 rounded border border-theme"
                  style={{ backgroundColor: theme.light.danger }}
                  title="Danger"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;

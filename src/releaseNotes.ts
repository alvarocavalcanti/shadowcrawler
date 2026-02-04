export interface ReleaseHighlight {
  version: string;
  date: string;
  highlights: string[];
}

export const releaseHighlights: ReleaseHighlight[] = [
  {
    version: "2026-02-04",
    date: "February 4, 2026",
    highlights: [
      "🎨 New customizable color themes - Choose from 4 beautiful palettes",
      "⚡ 96% smaller CSS bundle for faster loading",
      "🚀 20% fewer modules for improved performance",
      "🎯 Tab navigation replacing dropdown menu",
      "🌙 Better dark mode support with improved contrast"
    ]
  },
  {
    version: "2026-02-03",
    date: "February 3, 2026",
    highlights: [
      "☕ Ko-fi donation link added",
      "📦 Security fix for prismjs vulnerability",
      "📚 Enhanced project documentation"
    ]
  }
];

export const changelogUrl = "https://github.com/alvarocavalcanti/shadowcrawler";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export const getItemText = (item: any) => {
  return item.text.richText[0].children[0].text ? item.text.richText[0].children[0].text : item.text.plainText;
};

export const isDevMode = (): boolean => {
  return localStorage.getItem("dev-mode") === "true";
};

export const analytics = {
  page: () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view');
    }
  },
  track: (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, properties);
    }
  }
};

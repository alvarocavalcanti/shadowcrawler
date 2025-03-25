
import googleAnalytics from '@analytics/google-analytics';
import Analytics from 'analytics';

export const getItemText = (item: any) => {
  return item.text.richText[0].children[0].text ? item.text.richText[0].children[0].text : item.text.plainText;
};

export const isDevMode = (): boolean => {
  return localStorage.getItem("dev-mode") === "true";
};

export const analytics = Analytics({
  app: 'awesome-app',
  plugins: [
    googleAnalytics({
      measurementIds: ['G-1TBFXRLMWR']
    })
  ]
})

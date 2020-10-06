export const getDatetimeQuestion = (text: string, title: string) => ({
  text,
  buttons: [
    {
      type: 'web_url',
      title,
      url: `${process.env.EXTENSIONS_URL}/extensions/datetime`,
      messenger_extensions: true,
      webview_height_ratio: 'compact',
    },
  ],
});

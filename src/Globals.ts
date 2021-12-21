// This base url is used to load any static images, fonts, etc.
// For in-browser usage of design-docs, this works well.
// Webpack usage of design-docs is something I'll think more about.
window.designDocsBaseUrl = new URL("..", import.meta.url).href;

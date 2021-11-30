import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  /* NextJs is server side rendering, so the StyledComponents randomly generate
     ids sometimes don't match the browser rendered ids. To fix these errors that
     will appear in the browser logs, we use getInitialProps.

     sheet.collectStyles is the magic. It goes through every component with 
     StyledComponents, pulls out all the css needed, and has it render serverside
     and then feed it to the <App />. This basically causes the app to wait to 
     render until all styles are loaded so we don't get that "flicker" of default
     browser styles before the app styles load. Boom.
  */
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(
      // eslint-disable-next-line react/jsx-props-no-spreading
      (App) => (props) => sheet.collectStyles(<App {...props} />)
    );

    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

import Head from 'next/head';

// eslint-disable-next-line react/prop-types
export default function SeoHead({ children }) {
  return (
    <Head>
      <title>{children}</title>
    </Head>
  );
}

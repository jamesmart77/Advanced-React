// Next.js /product/any id
// [] in the file or folder name translates to a query param for Next.JS

import SingleProduct from '../../components/SingleProduct';

// eslint-disable-next-line react/prop-types
export default function SingleProductPage({ query }) {
  // eslint-disable-next-line react/prop-types
  const { id } = query;
  return <SingleProduct id={id} />;
}

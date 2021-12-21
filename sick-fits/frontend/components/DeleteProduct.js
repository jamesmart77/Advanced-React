import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  // cache === apollo cache, payload gets returned from mutation update
  console.log('running update function after delete....');
  cache.evict(cache.identify(payload.data.deleteProduct)); // cache functions are inlcuded in apollo v3 api
}

// eslint-disable-next-line react/prop-types
export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
    update,
  });

  const handleClick = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this item?')) {
      deleteProduct(id).catch((err) => alert(err.message));
    }
  };

  return (
    <button disabled={loading} type="button" onClick={handleClick}>
      {children}
    </button>
  );
}

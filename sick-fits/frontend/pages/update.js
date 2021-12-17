import UpdateProduct from '../components/UpdateProduct';

// route /update
export default function UpdatePage({ query }) {
  return (
    <div>
      <UpdateProduct id={query.id} />
    </div>
  );
}

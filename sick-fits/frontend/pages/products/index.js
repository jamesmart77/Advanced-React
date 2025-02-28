import { useRouter } from 'next/dist/client/router';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';

// route /products --> based on file name in /pages
export default function ProductsPage() {
  const { query } = useRouter();
  const page = parseInt(query.page);

  return (
    <div>
      <Pagination page={page || 1} />
      <Products page={page || 1} />
      <Pagination page={page || 1} />
    </div>
  );
}

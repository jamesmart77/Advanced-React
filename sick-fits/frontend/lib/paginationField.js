import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we are handling everything
    read(existing = [], { args, cache }) {
      // first thing apollo will do is ask for Read function for "those" items

      /* we can either do one of two things:
        1. We can return the items bc they're already in cache
        2. we can return false here (invoke network request)
      */

      const { skip, first } = args;

      // read # of items of the page from cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      const items = existing.slice(skip, skip + first).filter((item) => item); // remove any undefined items

      /* IF
        1. there are items
        2. AND there aren't enough items to satisfy how many were requested (ie. only 1 for a page supporting 2 items)
        3. AND we are on the last page

        THEN just send it
      */
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      // check if we have existing items
      if (items.length !== first) {
        // no items found...go to network for allProducts
        return false;
      }

      // if there are items, return them from cache and don't go to the network
      if (items.length) return items;

      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      /*
        this runs when apollo client returns from network with allProducts

        -- define how we want to merge them in the cache
      */
      const { skip, first } = args;
      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      // eslint-disable-next-line no-plusplus
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // return merged items from cache
      return merged;
    },
  };
}

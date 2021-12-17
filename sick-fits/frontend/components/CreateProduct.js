import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTUTATION = gql`
  mutation CREATE_PRODUCT_MUTUTATION(
    # which variable are being passed in? and what types are they?
    $name: String! # ! means required in gql
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        photo: {
          # with productImages being a related, but separate entity, we can
          # nest the create function and have the relationship be created in a single function
          create: { image: $image, altText: $name }
        }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm } = useForm({
    name: 'bam',
    description: 'description',
    price: 1000,
    image: '',
  });

  // createProduct is the function that is bound by the hook to CREATE_PRODUCT_MUTUATION
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTUTATION,
    {
      // mapping to gql is automatic since inputs object has same key names
      variables: inputs,
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }], // refetch query after createProductMutation has successfully completed
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(inputs);
      await createProduct();
      clearForm();
      Router.push({
        pathname: `/product/${data.createProduct.id}`,
      });
      // eslint-disable-next-line no-shadow
    } catch (e) {
      console.error('Error: ', e.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input type="file" id="image" name="image" onChange={handleChange} />
        </label>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            type="text"
            id="description"
            name="description"
            placeholder="description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
      </fieldset>

      <button type="submit">+Add Product</button>
    </Form>
  );
}

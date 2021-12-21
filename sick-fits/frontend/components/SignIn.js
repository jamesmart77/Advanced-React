import gql from 'graphql-tag';
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const [signin, { data }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const error =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signin();
  };

  useEffect(() => {
    // redirect after successful login
    if (data && !error) {
      Router.push({
        pathname: `/`,
      });
    }
  }, [data, error]);

  return (
    <div>
      <Form method="post" onSubmit={handleSubmit}>
        <h2>Sign Into Your Account</h2>
        <DisplayError error={error} />
        <fieldset>
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              autoComplete="email"
              value={inputs.email}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="password">
            Email
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="password"
              value={inputs.password}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Sign In!</button>
          <button type="button" onClick={resetForm}>
            Reset
          </button>
        </fieldset>
      </Form>
    </div>
  );
}

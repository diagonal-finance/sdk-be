import { gql } from "graphql-request";

export const CREATE_CHECKOUT_SESSION_MUTATION = gql`
    mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
        createCheckoutSession(input: $input) {
            __typename
            ... on CheckoutSession {
                id
                url
            }
            ... on PackageNotFound {
                message
            }
            ... on InvalidExpiresAt {
                message
            }
            ... on Error {
                message
            }
        }
    }
`;

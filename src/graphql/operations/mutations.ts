import { gql } from "graphql-request";

export const CREATE_CHECKOUT_SESSION_MUTATION = gql`
    mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
        createCheckoutSession(input: $input) {
            __typename
            ... on CreateCheckoutSessionPayload {
                checkoutSession {
                    id
                    url
                }
            }
            ... on CreateCheckoutSessionPackageNotFound {
                message
            }
            ... on CreateCheckoutSessionInvalidExpiresAt {
                message
            }
            ... on Error {
                message
            }
        }
    }
`;

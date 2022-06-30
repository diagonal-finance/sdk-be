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

export const CREATE_PORTAL_SESSION_MUTATION = gql`
    mutation CreatePortalSession($input: CreatePortalSessionInput!) {
        createPortalSession(input: $input) {
            __typename
            ... on PortalSession {
                id
                url
            }
            ... on NoCustomerFoundError {
                message
            }
            ... on Error {
                message
            }
        }
    }
`;

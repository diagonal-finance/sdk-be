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

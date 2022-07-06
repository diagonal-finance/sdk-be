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
            ... on CreateCheckoutSessionPackageNotFoundError {
                message
            }
            ... on CreateCheckoutSessionInvalidExpiresAtError {
                message
            }
            ... on GenericError {
                message
            }
        }
    }
`;

export const CREATE_PORTAL_SESSION_MUTATION = gql`
    mutation CreatePortalSession($input: CreatePortalSessionInput!) {
        createPortalSession(input: $input) {
            __typename
            ... on CreatePortalSessionPayload {
                portalSession {
                    id
                    url
                }
            }
            ... on CreatePortalSessionCustomerNotFoundError {
                message
            }
            ... on CreatePortalSessionPackagesNotFoundError {
                message
            }
            ... on CreatePortalSessionServiceNotInChainError {
                message
            }
            ... on GenericError {
                message
            }
        }
    }
`;

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
            ... on CreatePortalSessionNoCustomerFoundError {
                message
            }
            ... on CreatePortalSessionNoPackageFoundError {
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

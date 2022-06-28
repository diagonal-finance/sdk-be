import { gql } from "graphql-request";

export const CREATE_CHECKOUT_SESSION_MUTATION = gql`
    mutation CheckoutSessionCreate($input: CheckoutSessionCreateInput!) {
        checkoutSessionCreate(input: $input) {
            ... on CheckoutSession {
                id
                url
            }
        }
    }
`;

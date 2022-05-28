export const CREATE_CHECKOUT_SESSION_MUTATION = `
mutation CheckoutSessionCreate($checkoutSessionInput: CheckoutSessionInput!) {
  checkoutSessionCreate(
    checkoutSessionInput: $checkoutSessionInput
  ) {
    uuid
    cancelUrl
    successUrl
  }
}
`;
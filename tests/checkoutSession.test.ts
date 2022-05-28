import {
    Diagonal,
    ICheckoutSessionInput,
    ICheckoutSessionResponse,
} from "../src";
import fetch from 'cross-fetch'
import { testConfig } from "./utils";

jest.mock('cross-fetch', () => {
    //Mock the default export
    return {
      __esModule: true,
      default: jest.fn()
    };
  });

// Checkout session class tests
describe("CheckoutSession tests", () => {

    const fetchMock = jest.mocked(fetch, true)
    

    describe("create tests", () => {
        it("Checkout session should be created successfully", async () => {

            const apiKey = 'abc'
            const diagonal = new Diagonal(apiKey);

            const checkoutSessionInput: ICheckoutSessionInput = {
                serviceAddress: '',
                packageRegistryId: 1,
                chainId: 80001,
                externalCustomerId: '12345',
                cancelUrl: 'https://service.com/cancel',
                successUrl: 'https://service.com/success',
            }

            fetchMock.mockResolvedValue({
                status: 200,
                json: () => {return { 
                  data: {
                      checkoutSessionCreate: {
                        uuid: 'abc',
                        cancelUrl: checkoutSessionInput.cancelUrl,
                        successUrl: checkoutSessionInput.successUrl,
                    }
                  } 
                }},
              } as any)


            const checkoutSessionResponse: ICheckoutSessionResponse = await diagonal.checkoutSession.create(checkoutSessionInput);
            expect(checkoutSessionResponse.uuid).toEqual(expect.any(String))
            expect(checkoutSessionResponse.cancelUrl).toEqual(checkoutSessionInput.cancelUrl)
            expect(checkoutSessionResponse.successUrl).toEqual(checkoutSessionInput.successUrl)
            expect(fetchMock).toBeCalledTimes(1)
            // expect(fetchMock).toBeCalledWith()

        })

        it("ApiKeyNotProvidedError should be thrown if API key is not provided", async () => {

        })

        it("UnauthorizedError should be thrown is the request is unauthorized", async () => {

          

        })

        it("CheckoutSessionApiError should be thrown is API error is thrown", async () => {

          

        })

        it("CheckoutSessionInvalidInputError should be thrown if there is an invalid input field", async () => {

          
        })
    })

});

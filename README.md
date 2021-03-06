<p align="center">
    <h1 align="center">
        Diagonal Backend SDK
    </h1>
    <p align="center">SDK for easier interaction with the Diagonal backend (webhooks).</p>
</p>

<p align="center">
    <a href="https://github.com/diagonal-finance/sdk-be/blob/master/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/diagonal-finance/sdk-be.svg?style=flat-square">
    </a>
    <a href="https://github.com/diagonal-finance/sdk-be/actions?query=workflow%3Atest">
        <img alt="GitHub Workflow test" src="https://img.shields.io/github/workflow/status/diagonal-finance/sdk-be/test?label=test&style=flat-square&logo=github">
    </a>
    <a href="https://coveralls.io/github/diagonal-finance/sdk-be">
        <img alt="Coveralls" src="https://img.shields.io/coveralls/github/diagonal-finance/sdk-be?label=coverage (ts)&style=flat-square&logo=coveralls">
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint">
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier">
    </a>
</p>

<div align="center">
    <h4>
        <a href="/CONTRIBUTING.md">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="/CODE_OF_CONDUCT.md">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/diagonal-finance/sdk-be/issues/new/choose">
            🔎 Issues
        </a>
    </h4>
</div>

| Diagonal SDK backend is a collection of classes which enables developers easier interaction with the Diagonal backend. |
| ---------------------------------------------------------------------------------------------------------------------- |

♜ [Jest](https://jestjs.io/) tests & common test coverage for all packages (`npm test`)\
♞ [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) to keep the code neat and well organized (`npm run format` & `npm run lint`)\
♝ Automatic deployment of documentation generated with [typedocs](https://typedoc.org/)

---

## 📦 Package

<table>
    <th>Package</th>
    <th>Version</th>
    <th>Downloads</th>
    <th>Size</th>
    <tbody>
        <tr>
            <td>
                <a href="https://github.com/diagonal-finance/sdk-be">
                    @diagonal-finance/sdk-be
                </a>
                 <a href="https://github.com/diagonal-finance/sdk-be">
                    (docs)
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@diagonal-finance/sdk-be">
                    <img src="https://img.shields.io/npm/v/@diagonal-finance/sdk-be.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@diagonal-finance/sdk-be">
                    <img src="https://img.shields.io/npm/dm/@diagonal-finance/sdk-be.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
            <td>
                <!-- Size -->
                <a href="https://bundlephobia.com/package/@diagonal-finance/sdk-be">
                    <img src="https://img.shields.io/bundlephobia/minzip/@diagonal-finance/sdk-be" alt="npm bundle size (scoped)" />
                </a>
            </td>
        </tr>
    <tbody>
</table>

## 🛠 Installation

### ESMModule:

```bash
yarn add @diagonal-finance/sdk-be
```

## 📜 Usage

### ESModule:

#### Webhook:

```typescript
import {
  IWebhookEvent,
  WebhookEvent,
  DiagonalError,
} from '@diagonal-finance/sdk-be'

import express from 'express'

const app = express()
const endpointSecret = '78...b1'

// Parse body into JSON
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  let payload = req.body
  let signatureHeader = req.headers['diagonal-signature'] as string

  let event: IWebhookEvent

  try {
    event = WebhookEvent.construct(payload, signatureHeader, endpointSecret)
  } catch (e) {
    if (e instanceof DiagonalError.InvalidPayloadError) {
      // handle invalid payload error
    } else if (e instanceof DiagonalError.InvalidEndpointSecretError) {
      // handle invalid endpoint secret error
    } else if (e instanceof DiagonalError.InvalidSignatureHeaderError) {
      // handle invalid signature header
    } else if (e instanceof DiagonalError.InvalidSignatureError) {
      // handle invalid signature error
    } else {
      // handle another type of error
    }
    return res.sendStatus(400)
  }

  // Handle the event
  switch (event.type) {
    case WebhookEvent.Type.SubscriptionAcknowledged:
      console.log(
        `Account ${event.customerAddress} subscription was acknowledged!`,
      )
      // Then define and call a method to handle the acknowledged event
      // handleAcknowledged(data);
      break
    case WebhookEvent.Type.SubscriptionFinalized:
      console.log(
        `Account ${event.customerAddress} subscription was finalized!`,
      )
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handleFinalized(event);
      break
    case WebhookEvent.Type.SubscriptionReorged:
      console.log(`Account ${event.customerAddress} subscription was re-orged!`)
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handleReorg(event);
      break
    case WebhookEvent.Type.SubscriptionCanceled:
      console.log(`Account ${event.customerAddress} has canceled the subscription!`)
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handleUnsubscribe(event);
      break
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`)
  }

  // Return a 200 response to acknowledge receipt of the event
  res.sendStatus(200)
})


...

app.listen(3000, () => console.log('Running on port 3000'));

```

#### Checkout session

```typescript
import {
    Diagonal,
    Config,
    ICreateCheckoutSessionInput,
} from "@diagonal-finance/sdk-be";

const express = require("express");
const app = express();

const apiKey = "abc...";
const diagonal = new Diagonal(apiKey);
const YOUR_DOMAIN = "http://example.com";

app.post("/create-checkout-session", async (req, res) => {
    const checkoutSessionInput: ICreateCheckoutSessionInput = {
        customerId: "de49e7f2-bc33-4f4f-a3ae-c1207b02819c", // Immutable ID of your customer.
        packageId: "ff4e1d23-54ab-4385-9ea9-02c58ec5e32a",
        allowedChains: [Config.ChainId.Mumbai], // Optional. Can be used to limit to specific chains on runtime.
        cancelUrl: new URL(`${YOUR_DOMAIN}/cancel`),
        successUrl: new URL(`${YOUR_DOMAIN}/success`),
        optimisticRedirect: true, // Optional. Used to redirect to the success url if TX has been confirmed (no waiting for long confirmation).
    };

    const checkoutSession = await diagonal.checkout.sessions.create(
        checkoutSessionInput
    );

    console.info(`Checkout session created, UUID: ${checkoutSession.id}`);

    res.redirect(303, checkoutSession.url);
});
```

#### Portal Session

```typescript
import {
    Diagonal,
    Config,
    ICreatePortalSessionInput,
} from "@diagonal-finance/sdk-be";

const express = require("express");
const app = express();

const apiKey = "abc...";
const diagonal = new Diagonal(apiKey);
const YOUR_DOMAIN = "http://example.com";

app.post("/create-portal-session", async (req, res) => {
    const portalSessionInput: ICreatePortalSessionInput = {
        customerId: "de49e7f2-bc33-4f4f-a3ae-c1207b02819c", // Immutable ID of your customer. Should not be email nor phone number.
        configuration: {
            availableChains: [Config.ChainId.Polygon],
            availablePackages: ["de49e7f2-bc33-4f4f-a3ae-c1207b02819c"],
        },
        returnUrl: new URL(`${YOUR_DOMAIN}/return`),
    };

    const portalSession = await diagonal.portal.sessions.create(
        portalSessionInput
    );

    console.info(`Portal session created, UUID: ${portalSession.id}`);

    res.redirect(303, portalSession.url);
});
```

## 🛠 Development

Clone this repository and install the dependencies:

```bash
git clone https://github.com/diagonal-finance/sdk-be.git
cd sdk-be && npm i
```

### 📜 Usage

```bash
npm run lint # Syntax check with ESLint (yarn lint:fix to fix errors).
npm run prettier # Syntax check with Prettier (yarn prettier:fix to fix errors).
npm test # Run tests (with common coverage).
npm run build # Create a JS build.
npm run publish # Publish a package on npm.
```

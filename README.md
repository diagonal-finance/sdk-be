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

| Diagonal SDK backend is a collection of classes which enables developers easier interaction with the Diagonal backend (webhooks). |
| --------------------------------------------------------------------------------------------------------------------------------- |

♜ [Jest](https://jestjs.io/) tests & common test coverage for all packages (`yarn test`)\
♞ [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) to keep the code neat and well organized (`yarn prettier` & `yarn lint`)\
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

```typescript
import {
    Diagonal, InvalidSignatureHeaderError,
    InvalidPayloadError, InvalidEndpointSecretError,
    InvalidSignatureError, IEvent
} from "@diagonal-finance/sdk-be";

...

app.post("/webhookEndpoint", (req, res) => {

    let endpointSecret = "78...b1"; // random 64 character secret
    let payload = req.body;
    let signatureHeader = req.headers['diagonal-signature'];

    const diagonal = new Diagonal();
    let event: IEvent;
    try {
        event = diagonal.constructEvent(payload, signatureHeader as string, endpointSecret);

        console.log("event", event);
        // handle diagonal event...

        res.status(200);
        res.json({success: true})
    } catch (e) {

     if(e instanceof InvalidPayloadError) {
        // handle invalid payload error
     } else if (e instanceof InvalidEndpointSecretError) {
         // handle invalid endpoint secret error
    } else if (e instanceof InvalidSignatureHeaderError) {
        // handle invalid signature header
     } else if (e instanceof InvalidSignatureError) {
        // handle invalid signature error
     } else {
        // handle another type of error
     }
        res.status(500);
        res.json({error: e})
    }

});

...

```

## 🛠 Development

Clone this repository and install the dependencies:

```bash
git clone https://github.com/diagonal-finance/sdk-be.git
cd sdk-be && yarn
```

### 📜 Usage

```bash
yarn lint # Syntax check with ESLint (yarn lint:fix to fix errors).
yarn prettier # Syntax check with Prettier (yarn prettier:fix to fix errors).
yarn test # Run tests (with common coverage).
yarn build # Create a JS build.
yarn publish # Publish a package on npm.
```

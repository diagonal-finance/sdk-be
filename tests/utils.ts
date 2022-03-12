export const testConfig = {
    subscriptionPayload: {
        subscriber: "0x4Ea66bE6947D711Ed963fc4aa8c04c5a4da6959B",
        service: "0x245312DBb10B1eada0d4E597bDe17134845Bd787",
        superToken: "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7",
        packageId: 1,
        flowRate: 5787037037037,
        feeRate: 0,
        chainId: 80001,
        eventType: "UNSUBSCRIBE",
    },
    signatureHeader:
        "t=1647115932683,v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
    invalidSignatureHeaders: [
        "",
        "t=1647115932683",
        "v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
        "1647115932683",
        "c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
        "t1647115932683,v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
        "t=1647115932683,v0c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
        "1647115932683,c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962ccedd",
        "t=16471159326,v0=c8ac659381d2d5fdfd07b965b47adab7fd1f0121d91446563fdd551f962cced",
    ],
    endpointSecret:
        "788284448d0ffabed8b47e6ed1848de4b7522257f6b516a7cc75e6da15905cb1",
};

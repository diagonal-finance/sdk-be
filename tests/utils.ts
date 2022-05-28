export const testConfig = {
    subscriptionPayload: {
        customerAddress: "0x4Ea66bE6947D711Ed963fc4aa8c04c5a4da6959B",
        serviceAddress: "0x245312DBb10B1eada0d4E597bDe17134845Bd787",
        superTokenAddress: "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7",
        packageId: 1,
        flowRate: 5787037037037,
        chainId: 80001,
        event: "SUBSCRIPTION_ACKNOWLEDGED",
    },
    signatureHeader:
        "t=1647115932683,v0=fe59e0d9a2c42a5c48bd2543c942928d804d3af7b076597a69660e633802dfac",
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

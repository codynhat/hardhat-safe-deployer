"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSafeDeployer = void 0;
require("@nomiclabs/hardhat-ethers");
const config_1 = require("hardhat/config");
const adapter_1 = require("./adapter");
const setupSafeDeployer = (signerAddress, safeAddress, serviceUrl) => {
    config_1.extendEnvironment((env) => {
        env.network.provider = new adapter_1.SafeProviderAdapter(env.network.provider, env.ethers.getSigner(signerAddress).then(s => s), safeAddress, serviceUrl);
    });
};
exports.setupSafeDeployer = setupSafeDeployer;
//# sourceMappingURL=index.js.map
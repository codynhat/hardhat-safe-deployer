"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeProviderAdapter = void 0;
const ethers_1 = require("ethers");
const safe_ethers_adapters_1 = require("@gnosis.pm/safe-ethers-adapters");
const safe_core_sdk_1 = __importDefault(require("@gnosis.pm/safe-core-sdk"));
const safe_ethers_lib_1 = __importDefault(require("@gnosis.pm/safe-ethers-lib"));
class SafeProviderAdapter {
    constructor(wrapped, signer, safeAddress, serviceUrl) {
        this.submittedTxs = new Map();
        this.createLibAddress = "0x8538FcBccba7f5303d2C679Fa5d7A629A8c9bf4A";
        this.createLibInterface = new ethers_1.utils.Interface(["function performCreate(uint256,bytes)"]);
        this.safeInterface = new ethers_1.utils.Interface(["function nonce() view returns(uint256)"]);
        this.wrapped = wrapped;
        this.signer = signer;
        this.safe = this.signer.then((_signer) => {
            const ethAdapter = new safe_ethers_lib_1.default({
                ethers: ethers_1.ethers,
                signer: _signer
            });
            return safe_core_sdk_1.default.create({
                ethAdapter,
                safeAddress,
            });
        });
        this.safeService = new safe_ethers_adapters_1.SafeService(serviceUrl !== null && serviceUrl !== void 0 ? serviceUrl : "https://safe-transaction.gnosis.io/");
        this.safeSigner = this.safe.then(s => new safe_ethers_adapters_1.SafeEthersSigner(s, this.safeService, this.wrapped));
    }
    sendAsync(payload, callback) {
        return this.wrapped.sendAsync(payload, callback);
    }
    async request(args) {
        var _a;
        const safeAddress = await this.safe.then(s => s.getAddress());
        if (args.method === 'eth_sendTransaction' && args.params && ((_a = args.params[0].from) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === safeAddress.toLowerCase()) {
            const tx = args.params[0];
            return this.safeSigner.then(s => s.sendTransaction(tx));
        }
        if (args.method === 'eth_getTransactionByHash') {
            let txHash = args.params[0];
            if (this.submittedTxs.has(txHash)) {
                return this.submittedTxs.get(txHash);
            }
        }
        const result = await this.wrapped.request(args);
        if (args.method === 'eth_accounts') {
            result.push(this.safe);
        }
        return result;
    }
    addListener(event, listener) {
        return this.wrapped.addListener(event, listener);
    }
    on(event, listener) {
        return this.wrapped.on(event, listener);
    }
    once(event, listener) {
        return this.wrapped.once(event, listener);
    }
    removeListener(event, listener) {
        return this.wrapped.removeListener(event, listener);
    }
    off(event, listener) {
        return this.wrapped.off(event, listener);
    }
    removeAllListeners(event) {
        return this.wrapped.removeAllListeners(event);
    }
    setMaxListeners(n) {
        return this.wrapped.setMaxListeners(n);
    }
    getMaxListeners() {
        return this.wrapped.getMaxListeners();
    }
    listeners(event) {
        return this.wrapped.listeners(event);
    }
    rawListeners(event) {
        return this.wrapped.rawListeners(event);
    }
    emit(event, ...args) {
        return this.wrapped.emit(event, ...args);
    }
    listenerCount(event) {
        return this.wrapped.listenerCount(event);
    }
    prependListener(event, listener) {
        return this.wrapped.prependListener(event, listener);
    }
    prependOnceListener(event, listener) {
        return this.wrapped.prependOnceListener(event, listener);
    }
    eventNames() {
        return this.wrapped.eventNames();
    }
    async send(method, params) {
        return await this.request({ method, params });
    }
}
exports.SafeProviderAdapter = SafeProviderAdapter;
//# sourceMappingURL=adapter.js.map
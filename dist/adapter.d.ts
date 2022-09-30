import { EthereumProvider, JsonRpcRequest, JsonRpcResponse, RequestArguments } from "hardhat/types";
import { utils, Signer } from "ethers";
import { SafeService, SafeEthersSigner } from "@gnosis.pm/safe-ethers-adapters";
import Safe from "@gnosis.pm/safe-core-sdk";
export declare class SafeProviderAdapter implements EthereumProvider {
    submittedTxs: Map<string, any>;
    createLibAddress: string;
    createLibInterface: utils.Interface;
    safeInterface: utils.Interface;
    safe: Promise<Safe>;
    safeService: SafeService;
    safeSigner: Promise<SafeEthersSigner>;
    signer: Promise<Signer>;
    wrapped: any;
    constructor(wrapped: any, signer: Promise<Signer>, safeAddress: string, serviceUrl?: string);
    sendAsync(payload: JsonRpcRequest, callback: (error: any, response: JsonRpcResponse) => void): void;
    request(args: RequestArguments): Promise<unknown>;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(event: string | symbol): Function[];
    rawListeners(event: string | symbol): Function[];
    emit(event: string | symbol, ...args: any[]): boolean;
    listenerCount(event: string | symbol): number;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    eventNames(): (string | symbol)[];
    send(method: string, params: any): Promise<any>;
}
//# sourceMappingURL=adapter.d.ts.map
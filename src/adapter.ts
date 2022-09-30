import { EthereumProvider, JsonRpcRequest, JsonRpcResponse, RequestArguments } from "hardhat/types";
import { utils, Signer, ethers } from "ethers";
import { SafeService, SafeEthersSigner } from "@gnosis.pm/safe-ethers-adapters";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";

export class SafeProviderAdapter implements EthereumProvider {

    submittedTxs = new Map<string, any>();

    createLibAddress = "0x8538FcBccba7f5303d2C679Fa5d7A629A8c9bf4A"
    createLibInterface = new utils.Interface(["function performCreate(uint256,bytes)"])
    safeInterface = new utils.Interface(["function nonce() view returns(uint256)"])
    safe: Promise<Safe>
    safeService: SafeService
    safeSigner: Promise<SafeEthersSigner>
    signer: Signer
    wrapped: any
    constructor(wrapped: any, signer: Signer, safeAddress: string, serviceUrl?: string) {
        this.wrapped = wrapped
        this.signer = signer
        const ethAdapter = new EthersAdapter({
          ethers: ethers as any,
          signer: signer as any
        });
        this.safe = Safe.create({
          ethAdapter,
          safeAddress,
        });
        this.safeService = new SafeService(serviceUrl ?? "https://safe-transaction.gnosis.io/");
        this.safeSigner = this.safe.then(s => new SafeEthersSigner(s, this.safeService, this.wrapped));
    }

    sendAsync(payload: JsonRpcRequest, callback: (error: any, response: JsonRpcResponse) => void): void {
        return this.wrapped.sendAsync(payload, callback)
    }

    async request(args: RequestArguments): Promise<unknown> {
        const safeAddress = await this.safe.then(s => s.getAddress())
        if (args.method === 'eth_sendTransaction' && args.params && (args.params as any)[0].from?.toLowerCase() === safeAddress.toLowerCase()) {
            const tx = (args.params as any)[0]
            return this.safeSigner.then(s => s.sendTransaction(tx))
        }
        if (args.method === 'eth_getTransactionByHash') {
            let txHash = (args.params as any)[0]
            if (this.submittedTxs.has(txHash)) {
                return this.submittedTxs.get(txHash);
            }
        }
        const result = await this.wrapped.request(args)
        if (args.method === 'eth_accounts') {
            result.push(this.safe)
        }
        return result
    }
    addListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return this.wrapped.addListener(event, listener)
    }
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return this.wrapped.on(event, listener)
    }
    once(event: string | symbol, listener: (...args: any[]) => void): this {
        return this.wrapped.once(event, listener)
    }
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return this.wrapped.removeListener(event, listener)
    }
    off(event: string | symbol, listener: (...args: any[]) => void): this {
        return this.wrapped.off(event, listener)
    }
    removeAllListeners(event?: string | symbol): this {
        return this.wrapped.removeAllListeners(event)
    }
    setMaxListeners(n: number): this {
        return this.wrapped.setMaxListeners(n)
    }
    getMaxListeners(): number {
        return this.wrapped.getMaxListeners()
    }
    listeners(event: string | symbol): Function[] {
        return this.wrapped.listeners(event)
    }
    rawListeners(event: string | symbol): Function[] {
        return this.wrapped.rawListeners(event)
    }
    emit(event: string | symbol, ...args: any[]): boolean {
        return this.wrapped.emit(event, ...args)
    }
    listenerCount(event: string | symbol): number {
        return this.wrapped.listenerCount(event)
    }
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return this.wrapped.prependListener(event, listener)
    }
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return this.wrapped.prependOnceListener(event, listener)
    }
    eventNames(): (string | symbol)[] {
        return this.wrapped.eventNames()
    }
    async send(method: string, params: any): Promise<any> {
        return await this.request({ method, params })
    }
}
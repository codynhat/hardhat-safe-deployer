import "@nomiclabs/hardhat-ethers";
import { extendEnvironment } from "hardhat/config"
import { SafeProviderAdapter } from "./adapter"
import { Signer } from "ethers";

export const setupSafeDeployer = (signerAddress: string, safeAddress: string, serviceUrl?: string) => {
    extendEnvironment((env) => {
        env.network.provider = new SafeProviderAdapter(
          env.network.provider,
          env.ethers.getSigner(signerAddress).then(s => s as unknown as Signer),
          safeAddress,
          serviceUrl
        )
    })
}
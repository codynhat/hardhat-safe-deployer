import "@nomiclabs/hardhat-ethers";
import { extendEnvironment } from "hardhat/config"
import { SafeProviderAdapter } from "./adapter"
import { Signer } from "ethers";

export const setupSafeDeployer = (signer: Signer, safeAddress: string, serviceUrl?: string) => {
    extendEnvironment((env) => {
        env.network.provider = new SafeProviderAdapter(
          env.network.provider,
          signer.connect(env.ethers.provider),
          safeAddress,
          serviceUrl
        )
    })
}
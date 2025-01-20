import { RpcProvider, constants } from "starknet"

export const EKUBO_CORE_MAINNET_ADDRESS = "0x00000005dd3D2F4429AF886cD1a3b08289DBcEa99A294197E9eB43b0e0325b4b";
export const EKUBO_POSITIONS_MAINNET_ADDRESS = "0x02e0af29598b407c8716b17f6d2795eca1b471413fa03fb145a5e33722184067";


export const CHAIN_ID =
  process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? constants.NetworkName.SN_MAIN
    : constants.NetworkName.SN_SEPOLIA

const NODE_URL = "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/0pG_54sTivt8faMuQTfrp4MCO5DjHbLW";

export const provider = new RpcProvider({
  nodeUrl: NODE_URL,
})

export const ARGENT_SESSION_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_ARGENT_SESSION_SERVICE_BASE_URL ||
  "https://cloud.argent-api.com/v1"

export const ARGENT_WEBWALLET_URL =
  process.env.NEXT_PUBLIC_ARGENT_WEBWALLET_URL || "https://web.argent.xyz"

 export const BRAAVOS_CHAIN_ID = CHAIN_ID == constants.NetworkName.SN_MAIN ?
  "0x534e5f4d41494e" : "0x534e5f5345504f4c4941";

import { defaultWagmiConfig } from "@web3modal/wagmi";
import { hardhat, localhost, polygonAmoy } from "viem/chains";

export const projectId = "17291c9d7c4cef59c5b58268c3b1c3e6";

// 2. Create wagmiConfig
const metadata = {
  name: "Supply Sphere",
  description: "Supply Sphere Orbiting SCM with blockchain",
  url: "http://localhost:3000", // origin must match your domain & subdomain
  icons: ["http://localhost:3000/favicon.ico"],
};

const chains = [hardhat, localhost, polygonAmoy] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  // ...wagmiOptions, // Optional - Override createConfig parameters
});

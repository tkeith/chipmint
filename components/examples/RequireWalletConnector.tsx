import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useNetwork } from "wagmi"
import DAppBase from "./WagmiBase"
import WalletNotConnectedWarning from "./WalletNotConnectedWarning"
import useIsMounted from '../../hooks/useIsMounted'
import WrongChainWarning from "./WrongChainWarning"

function Wrapper({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { chain } = useNetwork();
  const connectButtonStyle: { [key: string]: React.CSSProperties } = {
    container: {
      "padding-left": "15px",
      "padding-right": "15px",
    },
    btnStyle: {
      "display":"none"
    },
  };
  return (
    <> 
      <div style={isConnected && isMounted ? connectButtonStyle.btnStyle : connectButtonStyle.container}>
        <ConnectButton/>
      </div>
      {isMounted && isConnected && !chain?.unsupported && children}
      {isMounted && !isConnected && <WalletNotConnectedWarning />}
      {isMounted && isConnected && chain?.unsupported && <WrongChainWarning />}
    </>
  )
}


export default function RequireWalletContainer({ children }: { children: React.ReactNode }) {
  return (
    <DAppBase>
      <Wrapper>
      {children}
      </Wrapper>
    </DAppBase>
  )
}

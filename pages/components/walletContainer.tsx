import { ConnectButton } from "@rainbow-me/rainbowkit"
import DAppBase from "../../components/examples/WagmiBase"

function Wrapper({ children }: { children: React.ReactNode }) {
  return ( 
    <>
      <ConnectButton/>
    </>
  )
}

export default function WalletContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-0.5">
    <DAppBase>
      <Wrapper>
        {children}
      </Wrapper>
    </DAppBase>
    </div>
  )
}

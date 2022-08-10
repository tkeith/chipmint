import {useState} from 'react'
import { TextButton } from '../../components/examples/misc'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import { useSendTransaction } from 'wagmi'
import { BigNumber } from 'ethers'
import WalletContainer from './walletContainer'
import logo from '../../public/images/logo.jpeg'

function ConnectedInfo() {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { data: balanceData } = useBalance({
      addressOrName: address,
      watch: true,
    });
  
    const { data, isIdle, isError, isLoading, isSuccess, sendTransaction } =
      useSendTransaction({
        request: {
          to: '0x108C9FCd65e80c9999B34F85888861B4E20AA54d',
          value: BigNumber.from('1'), // 1 wei
        },
      });
  
    return <>
      <p>
        Connected to {address}
      </p>
      <p>
        Balance: {balanceData?.formatted}
      </p>
      <p>
        Network: {chain?.name}
      </p>
      {isIdle && (
        <TextButton disabled={isLoading} onClick={() => sendTransaction()}>
          Send Transaction
        </TextButton>
      )}
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      {isError && <div>Error sending transaction</div>}
    </>
  }

  
function NavLink({to, children}: {to: string, children:any}) {
  return <a href={to} className={`mx-4`}>
  {children}
  </a>
}

function MobileNav({open, setOpen}: {open:any, setOpen:any}) {
    return (
        <div className={`absolute top-0 left-0 h-screen w-screen bg-white transform ${open ? "-translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out filter drop-shadow-md `}>
            <div className="flex items-center justify-center filter drop-shadow-md bg-white h-20"> {/*logo container*/}
                <a className="text-xl font-semibold" href=""> </a>
            </div>
            <div className="flex flex-col ml-4">
                <a className="text-xl font-medium my-4" href="/about" onClick={() => setTimeout(() => {setOpen(!open)}, 100)}>
                    About
                </a>
                <a className="text-xl font-normal my-4" href="/contact" onClick={() => setTimeout(() => {setOpen(!open)}, 100)}>
                    Contact
                </a>
            </div>  
        </div>
    )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
      return (
          <nav className="flex filter drop-shadow-md bg-white px-4 py-4 h-20 items-center">
              <MobileNav open={open} setOpen={setOpen}/>
              <div className="w-3/12 flex items-center">
                  <img src={logo.src} alt="Chipmint Logo" className="w-48"></img> 
              </div>
              <div className="w-9/12 flex justify-end items-center">
                  <div className="z-50 flex relative w-8 h-8 flex-col justify-between items-center md:hidden" onClick={() => {
                      setOpen(!open)
                  }}>
                      {/* hamburger button */}
                      <span className={`h-1 w-full bg-black rounded-lg transform transition duration-300 ease-in-out ${open ? "rotate-45 translate-y-3.5" : ""}`} />
                      <span className={`h-1 w-full bg-black rounded-lg transition-all duration-300 ease-in-out ${open ? "w-0" : "w-full"}`} />
                      <span className={`h-1 w-full bg-black rounded-lg transform transition duration-300 ease-in-out ${open ? "-rotate-45 -translate-y-3.5" : ""}`} />
                  </div>
  
                  <div className="hidden md:flex">
                      <NavLink to="/components/sender">
                        <p className="mt-1.5">SENDER</p>
                      </NavLink>
                      <NavLink to="/components/recipient">
                          <p className="mt-1.5">RECIPIENT</p>
                      </NavLink>
                      <WalletContainer>
                        <ConnectedInfo />
                      </WalletContainer>
                  </div>
              </div>
          </nav>
      )
  }

import Navbar from './navbar';
import axios from 'axios';
import {useEffect, useState} from 'react';
import SendSms from '../../public/images/sendsms.jpg';
import moment from 'moment';
import { useAccount, useSignMessage, useContractWrite, useProvider } from 'wagmi';
import RequireWalletContainer from '../../components/examples/RequireWalletContainer';
import TransparentUpgradableProxyABI from '../../public/abi/TransparentUpgradableProxyABI.json';

const contractAddress = "0xB788E3281F36C9f403d4fc8759bB5A8a6EA46306";

function SenderFunction() {
  
  enum VeriState {
    NotChecked = 1,
    Verified,
    EnterOtp,
    RequestingSignOtp,
    SigningOtp,
    CheckAuth,
    AskingAuth,
    RequestingSignAuth,
    SigningAuth,
    Authorized,
  };

  const addrPrefix = "https://app.chipmint.co/express"
  const isLive = true;
  

  const isBrowser = () => typeof window !== "undefined";
  if(isBrowser()) {
    if(window.signingAuthMessage === undefined) {
      window.signingAuthMessage = true;
      console.log("calling signauthmessage"); 
    }
  }

  const [isError, setIsError] = useState(false);
  const [value, setValue] = useState('');
  const [days, setDays]:any = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [curVeriState, setCurVeriState] = useState<VeriState>(VeriState.NotChecked);
  const [authMessageToSign, setAuthMessageToSign] = useState<string>("");
  const handleChange = (e: { target: { value: string; } ;}) => {
    const result = e.target.value.replace(/\D/g,'');
    setValue(result);
  }
 
  const getAuthMessage = async (event: React.FormEvent) => {
    event.preventDefault()
    signAuthMessage({message: authMessageToSign});
    if (isLive) {
      let url: string = addrPrefix + "/getAuthorizationMessageToSign";
      const axiosParams = new URLSearchParams();
      axiosParams.append("sender", walletAddress);
      axiosParams.append("qty", value);
      axiosParams.append("exp", String(days));
      console.log("getauth url", url);
      const res = await axios.get(url, {
        params: axiosParams
      })

      if (res.status == 200) {
        console.log("get auth message data:", res.data)
        const newMessageToSign: string = res.data.message;
        setAuthMessageToSign(newMessageToSign);
        setCurVeriState(VeriState.RequestingSignAuth);
        console.log("hello",newMessageToSign);
      } else {
        throw Error("get auth message failed");
      }
    } else {
      setCurVeriState(VeriState.AskingAuth);
    }
  }
  console.log("heyyy there", moment().format());
  console.log("currect epoch: ", moment().unix());
  console.log("Epoch Time:",Math.floor(moment().valueOf() / 1000) + days * 86400);
  
  const handleSendSMS = () => { 
    // const provider = useProvider();
    // const contract = useContract({
    //   addressOrName: contractAddress,
    //   contractInterface: TransparentUpgradableProxyABI,
    // })
    // console.log(contract);
    
  }
  // console.log('hey',value);
  // console.log(typeof(value));
  // console.log(Number(value));
  const { signMessage: signAuthMessage } = useSignMessage({
    onSuccess(data, variables) {
      window.signingAuthMessage = undefined;
      
      // Verify signature when sign message succeeds
    },
    onError(error, variables, context) {
      window.signingAuthMessage = undefined;
      setCurVeriState(VeriState.AskingAuth);
      throw Error(error.message);
    }
  });
  
  function contractCall() {
    const { config, error } = useContractWrite({
      addressOrName: contractAddress,
      contractInterface: TransparentUpgradableProxyABI,
      functionName: 'sendSms',
    })
    console.log("Hello...", config);
    const { write } = useContractWrite(config)
    return (
      <>
        <button disabled={!write} onClick={() => write?.()}>
        </button>
        {error && (
          <div>An error occurred preparing the transaction: {error.message}</div>
        )}
      </>
    )
  }

  console.log("signingauthmessage status:", window.signingAuthMessage);
  return (
    <>
    <Navbar />
    <div className="bg-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-3xl mx-auto pt-8 pb-8 text-center">
        <div className='box-border bg-green-50 opacity-80 h-auto w-88 p-20 justify-center rounded-lg'>
       <center><img src={SendSms.src} alt="SendSMSIcon" className='w-64 h-auto rounded-3xl'></img></center>
          <h1 className='font-sans text-2xl pt-3'>Sending SMS</h1>
          <div>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <label htmlFor="recipient_address" className="sr-only">
            Recipient Address
          </label>
        </div>
        
        <input
          type="text"
          name="recipient_address"
          id="recipient_address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter Wallet Address"
        />
      </div>

      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <label htmlFor="country" className="sr-only">
            Quantity of Messages
          </label>
        </div>
        
        <input
          type="text"
          name="quantity"
          id="quantity"
          value={value}
          onChange={handleChange}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter Quantity of Messages You Want To Send"
        />
      </div>
  
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <label htmlFor="country" className="sr-only">
            Expiration Period
          </label>
        </div>

        <input
          type="text"
          name="expiration_period"
          id="expiration_period"
          value={days}
          onChange={(e) => {
            setDays(e.target.value);
            if (e.target.value.length > 5) {
              setIsError(true);
            } 
          }}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter Days"
        />
      </div>
      <button 
      type="button"
      className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
      onClick={getAuthMessage}
      >
      Go back to page
      </button>
    </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default function Sender() {
  return (
    <RequireWalletContainer>
      <SenderFunction/>
    </RequireWalletContainer>
  );
}

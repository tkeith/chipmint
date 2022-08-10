import Navbar from './navbar'
import axios from 'axios'
import VerifyIcon from '../../public/images/verify_icon.jpg'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import AuthorizeIcon from '../../public/images/authorize_icon.png'
import { useAccount, useSignMessage } from 'wagmi';
import RequireWalletContainer from '../../components/examples/RequireWalletContainer';

const contractAddress = "0xB788E3281F36C9f403d4fc8759bB5A8a6EA46306";

function Authorize(props) {
  const [otp, setOtp] = useState('');
  return (
    <>
    {props ? null : <Recipient/>}
    <div className="bg-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-3xl mx-auto pt-8 pb-8 text-center">
        <div className='box-border bg-green-50 opacity-80 h-auto w-88 p-20 justify-center rounded-lg'>
       <center><img src={AuthorizeIcon.src} alt="Verify_Icon" className='w-64 h-auto'></img></center>
          <h1 className='font-sans text-2xl pt-3'>Authorization</h1>
          <div>
            <p>Your OTP should arrive in a few seconds.</p>
      <div className="mt-1 relative rounded-md shadow-sm">
        
        <input
          type="text"
          name="otp"
          id='otp'
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter OTP we sent you on your mobile number"
        />
      </div>
      <button type="button" name="authorizeBtn" id="authorizeBtn" className="inline-flex items-center px-4 py-2 mt-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm" onClick={props.requestOtp}>
        Authorize
        </button>
        </div>
        </div>
      </div>
    </div>
    </>
  )
}

function RecipientFunction() {
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
  const [mobile, setmobile] = useState('');
  const [isError, setIsError] = useState();
  const [open, setOpen] = useState(false);
  const [resObj, setResObj]:any = useState();

  const [curVeriState, setCurVeriState] = useState<VeriState>(VeriState.NotChecked);
  const [authMessageToSign, setAuthMessageToSign] = useState<string>("");
  // Request OTP 
  
  const isBrowser = () => typeof window !== "undefined";
  if(isBrowser()) {
    if(window.signingAuthMessage === undefined) {
      window.signingAuthMessage = true;
      console.log("calling signauthmessage"); 
    }
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
        setOpen(false);
      } else {
        throw Error("get auth message failed");
      }
    } else {
      setCurVeriState(VeriState.AskingAuth);
    }
  }

  const requestOtp = async (e: { target: { value: string; } ;}) => {
    let url: string = addrPrefix + "/requestOtp";
    const res = await axios.post(url, {
      phoneNumber: mobile
    }) .then(function (response) {
      setOpen(true); 
     //console.log(response);
      setResObj(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

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
  return (
    <>
    <Navbar />
    <div>
    {resObj ? <Authorize requestOtp={requestOtp}/> : null}
    <div className="bg-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-3xl mx-auto pt-8 pb-8 text-center">
        <div className='box-border bg-green-50 opacity-80 h-auto w-88 p-20 justify-center rounded-lg'>
       <center><img src={VerifyIcon.src} alt="Verify_Icon" className='w-64 h-auto'></img></center>
          <h1 className='font-sans text-2xl'>Verify My Number</h1>
          <div>
      <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
        Phone Number
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <label htmlFor="country" className="sr-only">
            Country
          </label>
          <select
            id="country"
            name="country"
            autoComplete="country"
            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
          >
            <option>US</option>
            <option>CA</option>
            <option>EU</option>
          </select>
        </div>
        <input
          type="text"
          name="phone-number"
          error={isError}
          value={mobile}
          id="phone-number"
          onChange={(e) => {
            setmobile(e.target.value);
            if (e.target.value.length > 10) {
              setIsError(true);
              console.log("Error");
            } 
          }}
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-16 sm:text-sm border-gray-300 rounded-md"
          placeholder="5559876543"
        />
        </div>
        <button type="button" name="authorizeBtn" id="authorizeBtn" className="inline-flex items-center px-4 py-2 mt-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm" onClick={requestOtp}>
          Get my OTP
        </button>
        <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                     Verification Successful
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        OTP Successfully sent to your device. 
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={getAuthMessage}
                  >
                    Go back to page
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
        </div>
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default function Recipient() {
  return (
    <>
    <RequireWalletContainer>
      <RecipientFunction/>
    </RequireWalletContainer>
    </>
  );
}

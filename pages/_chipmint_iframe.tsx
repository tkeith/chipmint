import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { verifyMessage, Bytes, hexlify } from 'ethers/lib/utils';
import RequireWalletContainer from '../components/examples/RequireWalletContainer'


enum VeriState {
  NotChecked = 1,
  notVerified,
  Verified,
  EnterOtp,
  requestingSignOtp,
  signingOtp,
  checkAuth,
  requestingSignAuth,
  signingAuth,
  Authorized,
};

const addrPrefix = "https://app.chipmint.co/express"
const isLive = true;

function PaymentElement() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Payment method</h3>
        <div className="mt-5">
          <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
            <h4 className="sr-only">Visa</h4>
            <div className="sm:flex sm:items-start">
              <svg className="h-8 w-auto sm:flex-shrink-0 sm:h-6" viewBox="0 0 36 24" aria-hidden="true">
                <rect width={36} height={24} fill="#224DBA" rx={4} />
                <path
                  fill="#fff"
                  d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                />
              </svg>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <div className="text-sm font-medium text-gray-900">Ending with 4242</div>
                <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                  <div>Expires 12/20</div>
                  <span className="hidden sm:mx-2 sm:inline" aria-hidden="true">
                    &middot;
                  </span>
                  <div className="mt-1 sm:mt-0">Last updated on 22 Aug 2017</div>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function VerificationElement(props) {
  // console.log(props.requestOtp)
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium m-3 text-gray-900">Verify your phone number</h3>

        <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Connect your phone number with your wallet on-chain.</p>
          </div>
          <form className="mt-5 sm:flex sm:items-center" onSubmit={props.requestOtp}>
            <div className="w-full sm:max-w-xs">
              <label htmlFor="verify-tel" className="sr-only">
                Phone Number
              </label>
              <input
                type="tel"
                name="tel"
                id="verify-tel"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="XXX-XXX-XXXX"
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Get my OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function EnterOtpElement(props) {
  // console.log(props.enterOtp)
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium m-3 text-gray-900">Enter the OTP sent to your SMS</h3>

        <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Your OPT should arrive in a few seconds.</p>
          </div>
          <form className="mt-5 sm:flex sm:items-center" onSubmit={props.enterOtp}>
            <div className="w-full sm:max-w-xs">
              <label htmlFor="verify-otp" className="sr-only">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                id="verify-otp"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="XXXXXX"
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Verify Now
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function VerifiedElement() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium m-3 text-gray-900">Your phone number is verified!</h3>
      </div>
    </div>
  )
}


function GetAuthElement(props) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium m-3 text-gray-900">Authorize app</h3>

        <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Permit {props.sender} to send you {props.qty} messages for {props.durationDays} days.</p>
          </div>
          <form className="mt-5 sm:flex sm:items-center" onSubmit={props.acceptAuth}>
            <button
              type="submit"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Authorize Now
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function getParamValue(paramName: string)
{
  const isBrowser = () => typeof window !== "undefined";
  if (!isBrowser()) {
    return;
  } 
  const url = window.location.search.substring(1); //get rid of "?" in querystring
  const qArray = url.split('&'); //get key-value pairs
  for (let i = 0; i < qArray.length; i++) 
  {
    let pArr = qArray[i].split('='); //split key and value
    if (pArr[0] === paramName) {
      return pArr[1]; //return value
    }
  }
}

async function checkAddressVerification(userAddr: string) {
  if (isLive) {
    const url = addrPrefix + "/isAddressVerified/" + userAddr;
    const res = await axios.get(url);
    if (res.status == 200) {
      console.log("verifiy check response:", res.data.verified);
      return res.data.verified === true;
    } else {
      throw Error("Address verification errored")
    }  
  } else {
    return true;
  }
}

function VerificationFlow (props) {
  console.log("props:", props);

  const userAddr = useAccount().address;
  if (userAddr === undefined) {
    throw Error("user addr undefined in wallet container")
  }

  const [curVeriState, setCurVeriState] = useState<VeriState>(VeriState.NotChecked);

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [messageToSign, setMessageToSign] = useState<string>("");

  console.log("starting veristate:", curVeriState);

  const requestOtp = async (event: React.FormEvent) => {
    event.preventDefault()
    let url: string = addrPrefix + "/requestOtp";
    const formData = new FormData(event.target as HTMLFormElement)

    if (isLive) {
      const newPhoneNumber = formData.get('tel') as string
      setPhoneNumber(newPhoneNumber);
      // alert("phonenumber from requestotp: " + newPhoneNumber);
      const res = await axios.post(url, {
        phoneNumber: newPhoneNumber
      });
      console.log("requestotp res:", res);
      if (res.status == 200) {
        setCurVeriState(VeriState.EnterOtp);
      } else {
        throw Error("request otp failed");
      }
    } else {
      setCurVeriState(VeriState.EnterOtp);
    }
  }

  const registerVerification = async (otp: string, signature: string) => {
    const url = addrPrefix + "/registerVerification";
    if (isLive) {
      const res = await axios.post(url, {
        phoneNumber, otp, signature
      });
      console.log("registerveri res:", res);
      if (res.status == 200) {
        setCurVeriState(VeriState.Verified);
      } else {
        setCurVeriState(VeriState.requestingSignOtp);
        throw Error("registerveri failed");
      }
    } else {
      setCurVeriState(VeriState.Verified);
    }

  }

  const { signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const recoveredAddr = verifyMessage(variables.message, data);
      if (recoveredAddr === userAddr) {
        registerVerification(otp, data);
      } else {
        throw Error(`User addr ${userAddr} and recovered addr ${recoveredAddr} don't match`)
      }
    },
    onError(error, variables, context) {
      setCurVeriState(VeriState.requestingSignOtp);
      throw Error(error);
    }
  });

  const enterOtp = async (event: React.FormEvent) => {
    event.preventDefault()
    let url: string = addrPrefix + "/checkOtp";
    const formData = new FormData(event.target as HTMLFormElement)

    if (isLive) {
      const newOtp = formData.get('otp') as string;
      setOtp(newOtp);
      const getUrl = url + "/" + phoneNumber + "/" + newOtp;
      // alert("phonenumber before enterotp: " + phoneNumber);
      console.log("enter otp url:", getUrl);
      const res = await axios.get(getUrl);
      if (res.status == 200) {
        console.log("enter otp data:", res.data)
        const isOtpValid = res.data.otpValid;
        if (isOtpValid) {
          const newMessageToSign: string = res.data.messageToSign;
          setMessageToSign(newMessageToSign);
          // Call metamask here
          setCurVeriState(VeriState.requestingSignOtp);
        } else {
          alert("OPT is invalid");
        }
      } else {
        throw Error("check otp failed");
      }
    } else {
      setCurVeriState(VeriState.requestingSignOtp);
    }
  }

  const isAuthorized = async (event: React.FormEvent) => {
    event.preventDefault()
    let url: string = addrPrefix + "/isAuthorized/" + props.sender + "/" + userAddr;

    if (isLive) {
      
    } else {
      setCurVeriState(VeriState.requestingSignAuth)
    }
  }

  // const styles: { [key: string]: React.CSSProperties } = {
  //   container: {
  //     width: 300,
  //     height: 300,
  //   },
  // };

  if (curVeriState === VeriState.NotChecked) {
    checkAddressVerification(userAddr).then((isAddressVerified) => {
      console.log("isaddrveri", isAddressVerified);
      if (isAddressVerified) {
        setCurVeriState(VeriState.Verified);
      }
    }).catch((reason) => {console.log(reason)});
  } else if (curVeriState === VeriState.requestingSignOtp) {
    setCurVeriState(VeriState.signingOtp);
    signMessage({message: messageToSign});
  } else if (curVeriState === VeriState.Verified && props.needAuth === true) {
    setCurVeriState(VeriState.GetAuth);
  }
  // console.log(curVeriState, curVeriState === VeriState.Verified, props.needAuth === true, props.needAuth)
  return (
    <div>
      {curVeriState === VeriState.NotChecked &&
        <VerificationElement requestOtp={requestOtp}/>
      }
      {curVeriState === VeriState.EnterOtp &&
        <EnterOtpElement enterOtp={enterOtp}/>}
      {curVeriState === VeriState.Verified && <VerifiedElement/>}
      {curVeriState === VeriState.GetAuth &&
        <GetAuthElement qty={props.qty} sender={props.sender} durationDays={props.durationDays} acceptAuth={acceptAuth}/>}
    </div>
  );
}

function IFrameElement() {
  
  let needAuthParam = getParamValue('needAuth');
  let needAuth = true;
  if (needAuthParam !== undefined ) {
    needAuth = needAuthParam === "true";
  }
  const qty = Number(getParamValue('qty') || 100);
  const durationDays = Number(getParamValue('durationDays') || 365);
  const sender = getParamValue('sender');

  return (
    <RequireWalletContainer>

      <VerificationFlow
        needAuth={needAuth}
        qty={qty}
        durationDays={durationDays}
        sender={sender}
      />
      {/* // <PaymentElement/> */}
    </RequireWalletContainer>
  );
}

export default IFrameElement;

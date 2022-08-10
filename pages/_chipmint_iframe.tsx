import axios from 'axios';
import React, { useState, useEffect } from 'react'

enum VeriState {
  NotChecked = 1,
  notVerified,
  Verified,
  SentOtp,
  confirmingOtp,
  GetAuth
};

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
  // console.log(props.saveText)
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium m-3 text-gray-900">Verify your phone number</h3>

        <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Connect your phone number with your wallet on-chain.</p>
          </div>
          <form className="mt-5 sm:flex sm:items-center" onSubmit={props.saveText}>
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
              <label htmlFor="verify-opt" className="sr-only">
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
  // console.log(props.saveText)
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium m-3 text-gray-900">Authorize app</h3>

        <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Permit app to send you XX messages until XXX.</p>
          </div>
          <form className="mt-5 sm:flex sm:items-center" onSubmit={props.acceptAuth}>
            <div className="w-full sm:max-w-xs">
              <label htmlFor="verify-tel" className="sr-only">
                SOME FIELD
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
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) 
    {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] === paramName) {
          return pArr[1]; //return value
        }
    }
}

function VerificationFlow (props) {
  console.log(props)
  
  const [curVeriState, setCurVeriState] = useState<VeriState>(VeriState.NotChecked);

  const saveText = async (event: React.FormEvent) => {
    event.preventDefault()
    let isLive: boolean = false;
    let url: string = "localhost:8005/requestOtp"
    const formData = new FormData(event.target as HTMLFormElement)

    if (isLive) {
      // const res = await axios.post(url, {
      //   phoneNumber: formData.get('tel') as string,
      // });
      const axiosParams = new URLSearchParams();
      axiosParams.append("phoneNumber", formData.get('tel') as string);
      const res = await axios.get(url, {
        params: axiosParams
      })
      if (res.status == 200) {
        setCurVeriState(VeriState.SentOtp);
      } else {
        alert("Error!")
      }
    } else {
      setCurVeriState(VeriState.SentOtp);
    }
  }

  const enterOtp = async (event: React.FormEvent) => {
    event.preventDefault()
    let isLive: boolean = false;
    let url: string = "localhost:8005/verifyOtp"
    const formData = new FormData(event.target as HTMLFormElement)

    if (isLive) {
      const res = await axios.post(url, {
        phoneNumber: formData.get('tel') as string,
        otp: formData.get('otp') as string,
      });
      // const axiosParams = new URLSearchParams();
      // axiosParams.append("phoneNumber", formData.get('tel') as string);
      // axiosParams.append("otp", formData.get('otp') as string);
      // const res = await axios.get(url, {
      //   params: axiosParams
      // })
      if (res.status == 200) {
        setCurVeriState(VeriState.Verified);
      } else {
        alert("Error!")
      }
    } else {
      setCurVeriState(VeriState.Verified);
    }
  }

  // const styles: { [key: string]: React.CSSProperties } = {
  //   container: {
  //     width: 300,
  //     height: 300,
  //   },
  // };
  if (curVeriState === VeriState.Verified && props.needAuth) {
    setCurVeriState(VeriState.GetAuth);
  }
  return (
    <div>
      {curVeriState === VeriState.NotChecked  && <VerificationElement saveText={saveText}/>
      }
      {curVeriState === VeriState.SentOtp && <EnterOtpElement enterOtp={enterOtp}/>}
      {curVeriState === VeriState.Verified && <VerifiedElement/>}
      {curVeriState === VeriState.GetAuth && <GetAuthElement/>}
    </div>
  );
}

function IFrameElement() {
  const props = {
    // needAuth: getParamValue('needAuth'),
    // msgQty: getParamValue('msgQty')
  }

  return (
    // <div>
      <VerificationFlow props={props}/>
      // <PaymentElement/>
    // </div>
  );
}

export default IFrameElement;

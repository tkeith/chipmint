import Navbar from './navbar'
import AuthorizeIcon from '../../public/images/authorize_icon.png'
import { SubmitButton } from '../../components/examples/misc'

export default function Authorize() {
  return (
    <>
    <Navbar />
    <div className="bg-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-3xl mx-auto pt-8 pb-8 text-center">
        <div className='box-border bg-green-50 opacity-80 h-auto w-88 p-20 justify-center rounded-lg'>
       <center><img src={AuthorizeIcon.src} alt="Verify_Icon" className='w-64 h-auto'></img></center>
          <h1 className='font-sans text-2xl pt-3'>Authorization</h1>
          <div>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <p>Your OTP should arrive in a few seconds.</p>
        </div>
        <input
          type="text"
          name="otp"
          id='otp'
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter OTP we sent you on your mobile number"
        />
      </div>
      <SubmitButton name="authorizeBtn" id="authorizeBtn">OK</SubmitButton>
    </div>
        </div>
      </div>
    </div>
    </>
  )
}

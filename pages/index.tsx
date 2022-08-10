import React, { useState } from 'react';

function ChipmintPreviewIFrame(props: any) {
  return (
    <div className="App border-dashed border border-black p-7 rounded-lg" >
      <iframe src={"http://localhost:8000/_chipmint_iframe?" +
        `needAuth=${props.tagArgs?.needAuth || "true"}&` + 
        `qty=${props.tagArgs?.qty || 100}&` +
        `durationDays=${props.tagArgs?.durationDays || 365}&` +
        `sender=${props.tagArgs?.sender || "THIS SHOULD NEVER APPEAR"}`
      }
        className="w-full h-80"
      />
    </div>
  );
}

function ChipmintPreviewFlow() {

  const [tagArgs, setTagArgs]: [tagArgs: any, setTagArgs: any] = useState({});

  let chipmintTag = "";
  if (Object.keys(tagArgs).length > 3) {
    console.log("setting chipmint Tag:", tagArgs);
    chipmintTag = `\
<iframe src=\`https://app.chipmint.co/_chipmint_iframe?
  needAuth=${tagArgs.needAuth}&
  qty=${tagArgs.qty}&
  durationDays=${tagArgs.durationDays}&
  sender=${tagArgs.sender}\`
/>`;
  }
  // console.log("tagArgs:", tagArgs.qty);
  // const tagTextStyle: { [key: string]: React.CSSProperties } = {
  //   container: {
  //     "font-family": "monospace",
  //     "color": "purple",
  //   },
  // };

  const generateTag = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement);

    const sender = formData.get('sender-addr') as string;
    const qty = Number(formData.get('qty'));
    const durationDays = Number(formData.get('duration-days'));
    const needAuth = 'true';
    // console.log("generatingTag")
    setTagArgs({
      sender, qty, durationDays, needAuth
    });
  }

  const copyTagToClipboard = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement);

    const chipmintTagCode = formData.get('chipmint-tag') as string;
    navigator.clipboard.writeText(chipmintTagCode).then(
      () => {
        // console.log('Async: Copying to clipboard was successful!');
      }, (err) => {
        console.error('Async: Could not copy text: ', err);
      }
    );
  }

  return (
    <>
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Try out your Chipmint plugin</h3>
              <p className="mt-1 text-sm text-gray-600">
                These parameters customize what your users authorize.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={generateTag}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="sender-addr" className="block text-sm font-medium text-gray-700">
                        Sender Address
                      </label>
                      <input
                        type="text"
                        name="sender-addr"
                        id="sender-addr"
                        placeholder="0x..."
                        // value={tagArgs.sender || "0x23D9E89D457404dB99b6addC8638cc0e4368Bb5c"}
                        // onChange={e => setTagArgs({ ...tagArgs, sender: e.target.value })}
                        className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="qty" className="block text-sm font-medium text-gray-700">
                        Number of messages
                      </label>
                      <input
                        type="number"
                        name="qty"
                        id="qty"
                        value={tagArgs.qty || 100}
                        onChange={e => setTagArgs({ ...tagArgs, qty: e.target.value})}
                        className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="duration-days" className="block text-sm font-medium text-gray-700">
                        Number of days before expiry
                      </label>
                      <input
                        type="number"
                        name="duration-days"
                        id="duration-days"
                        value={tagArgs.durationDays || 365}
                        onChange={e => setTagArgs({ ...tagArgs, durationDays: e.target.value})}
                        className="mt-1 focus:ring-sky-500 focus:border-sky-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Your Chipmint javascript tag</h3>
              <p className="mt-1 text-sm text-gray-600">Paste this into your website and get Chipmint. That&apos;s it!</p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={copyTagToClipboard}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div>
                    <div className="mt-1">
                      <textarea
                        id="chipmint-tag"
                        name="chipmint-tag"
                        rows={8}
                        spellCheck="false"
                        // style={tagTextStyle.container}
                        className="font-mono shadow-sm text-sky-500 focus:ring-sky-500 focus:border-sky-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        defaultValue={chipmintTag}
                      />
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    Copy to clipboard
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Chipmint Preview</h3>
              <p className="mt-1 text-sm text-gray-600">See how your Chipmint element will look.</p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            {Object.keys(tagArgs).length > 3 && <ChipmintPreviewIFrame tagArgs={tagArgs}/>}
          </div>
        </div>
      </div>

      {/* <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Chipmint Sender Preview</h3>
              <p className="mt-1 text-sm text-gray-600">See how you send SMS to a user by wallet address.</p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            Sender Side
          </div>
        </div>
      </div> */}
    </>
  )
}


function ChipmintTryoutFullPage() {
  return (
  <>
    <div className="min-h-full pt-16 pb-12 flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0 flex justify-center">
          <a href="/" className="inline-flex">
            <span className="sr-only">Chipmint</span>
            <img
              className="h-20 w-auto m-10"
              src="/logo.png"
              alt=""
            />
          </a>
        </div>
        <ChipmintPreviewFlow/>
        <div className="py-16">
          <div className="text-center">
            {/* <p className="text-sm font-semibold text-sky-600 uppercase tracking-wide">404 error</p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found.</h1>
            <p className="mt-2 text-base text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p> */}
            <div className="mt-6">
              <a href="https://polygonscan.com/address/0xB788E3281F36C9f403d4fc8759bB5A8a6EA46306" className="text-base font-medium text-sky-600 hover:text-sky-500">
                View contract on PolygonScan<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      {/* <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-4">
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Contact Support
          </a>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Status
          </a>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Twitter
          </a>
        </nav>
      </footer> */}
    </div>
  </>
  )
}

export default ChipmintTryoutFullPage;

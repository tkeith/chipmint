import React, { useState, useEffect } from 'react'

function TestElement() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}


function Chipmint() {
  /*
   * This function loads an iframe containing
   * a form and button that allows the user to enter their
   * phone number and get a verification code send to them
   * via SMS.
   */
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  // Creates an iframe and sets it to the state
  const createIframe = () => {
    const iframe = document.createElement('iframe');
    // iframe.src = 'https://chipmint.com/';
    iframe.style.width = '100%';
    iframe.style.height = '100px';
    iframe.insertAdjacentText("beforeend", "chipmint");
    // iframe.style.border = 'none';
    // iframe.style.overflow = 'hidden';
    // iframe.style.position = 'absolute';
    // iframe.style.top = '0';
    // iframe.style.left = '0';
    // iframe.style.zIndex = '-1';
    // iframe.style.visibility = 'hidden';
    // iframe.style.pointerEvents = 'none';
    // iframe.style.opacity = '0';
    // iframe.style.transition = 'opacity 0.5s ease-in-out';
    // iframe.style.transitionDelay = '0.5s';
    // iframe.style.transitionDuration = '0.5s';
    // iframe.style.transitionTimingFunction = 'ease-in-out';
    // iframe.style.transitionProperty = 'opacity';
    return iframe;
  }
  // Adds the iframe to the DOM and sets it to the state
  const addIframe = () => {
    const iframe = createIframe();
    document.body.appendChild(iframe);
    setIframe(iframe);
  }
  // Removes the iframe from the DOM and sets it to the state
  const removeIframe = () => {
    const iframe = document.getElementById('chipmint-iframe');
    if (iframe !== null) {
      iframe.remove();
      setIframe(null);
    }
  }
  // Toggles the iframe on and off
  const toggleIframe = () => {
    if (iframe) {
      removeIframe();
    } else {
      addIframe();
    }
  }
  // Adds the event listener to the button
  useEffect(() => {
    const button = document.getElementById('chipmint-button');
    if (button !== null) {
      button.addEventListener('click', toggleIframe);
      return () => {
        button.removeEventListener('click', toggleIframe);
      }  
    }
  } , [toggleIframe]);
  // Return a div containing the buttton with the element id "chipmint-button"
  return (
    <div>
      <button id="chipmint-button">
        Click to toggle Chipmint
      </button>
      <div id="chipmint-iframe"></div>
    </div>
  );
}

export {TestElement, Chipmint};

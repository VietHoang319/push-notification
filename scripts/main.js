/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

// eslint-disable-next-line max-len
const applicationServerPublicKey = 'BJIwNdfYpmsbYHuSSvPVTV5_PsUT2Bnkx-zoitZmM-3nCndzuy5ugoefx6qnShLcdL5Zh4NuFsq_qBb7i4XDWeQ';


// eslint-disable-next-line max-len
console.log('serviceWorker', 'serviceWorker' in navigator, ', PushManager', 'PushManager' in window, ', window', window);

const pushButton = document.querySelector('.js-push-btn');
let consoleBlock = document.getElementById('consoleBlock');


let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// console log window
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
      if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
              return;
          }
          seen.add(value);
      }
      return value;
  };
};


// Kiểm tra xem trình duyệt có hỗ trợ push manage không
// eslint-disable-next-line max-len
function handleLoading() {
  let strConsole = '';
  const consoleWindow = JSON.stringify(window, getCircularReplacer());
  // eslint-disable-next-line max-len
  strConsole += 'serviceWorker ' + ('serviceWorker' in navigator) + ', PushManager ' + ('PushManager' in window) + ', window \n' + consoleWindow + '\n';
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    let str = ''
    strConsole += 'Service Worker and Push are supported\n';

    navigator.serviceWorker.register('sw.js')
    .then(function(swReg) {
      str += ('Service Worker is registered\n');
      console.log('Service Worker is registered', swReg)

      swRegistration = swReg;
      initializeUI();
      consoleBlock.innerText = consoleBlock.innerText + str;
    })
    .catch(function(error) {
      str += ('Service Worker Error' + error + '\n');
      consoleBlock.innerText = consoleBlock.innerText + str;
    });
  } else {
    strConsole += 'Push messaging is not supported\n';
    pushButton.textContent = 'Push Not Supported\n';
  }
  consoleBlock.innerText = consoleBlock.innerText + strConsole;
}

// Kiểm tra xem người dùng đã đăng ký chưa
function initializeUI() {
  let strConsole = '';
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      strConsole += 'User IS subscribed.\n';
    } else {
      strConsole += 'User is NOT subscribed.\n';
    }
    consoleBlock.innerText = consoleBlock.innerText + strConsole;

    updateBtn();
  });
  consoleBlock.innerText = consoleBlock.innerText + strConsole;
}

// Thay đổi text của button tùy thuộc vào người dùng đã đăng ký chưa
function updateBtn() {
  let strConsole = '';
  console.log(Notification.permission);
  strConsole += (Notification.permission + '\n');
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
  consoleBlock.innerText = consoleBlock.innerText + strConsole;
}

// Đăng ký người dùng
function subscribeUser() {
  let strConsole = '';
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    strConsole += ('User is subscribed\n' + JSON.stringify(subscription) + '\n');
    consoleBlock.innerText = consoleBlock.innerText + strConsole;

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(error) {
    strConsole += ('Failed to subscribe the user: ' + error + '\n');
    consoleBlock.innerText = consoleBlock.innerText + strConsole;
    updateBtn();
  });
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function unsubscribeUser() {
  let strConsole = '';
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    strConsole += ('Error unsubscribing' + error + '\n');
    consoleBlock.innerText = consoleBlock.innerText + strConsole;
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    strConsole += ('User is unsubscribed.\n');
    consoleBlock.innerText = consoleBlock.innerText + strConsole;
    isSubscribed = false;

    updateBtn();
  });
}

function clearConsole() {
  consoleBlock.innerText = '';
}
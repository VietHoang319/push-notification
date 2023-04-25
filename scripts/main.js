'use strict';
const applicationServerPublicKey = 'BI7N1CLR5EsqDjnpToAUNS-c4ugUp6lwCX0gvDZ_w1J17bTdo_gC3Cym6kKsRZNhJHfyGedlBTD35EVyzYFtglU';

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

async function handleLoading() {
  if (checkIsWebPushSupported) {
    if (window.navigator.serviceWorker !== undefined) {
      await window.navigator.serviceWorker.register('/sw.js')
      .then(function(swReg) {
        let str = ('Service Worker is registered\n');
  
        console.log('Service Worker is registered', swReg)
  
        swRegistration = swReg;
        initializeUI();
        consoleBlock.innerText = consoleBlock.innerText + str;
      })
      .catch(function(error) {
        let str = ('Service Worker Error: ' + error + '\n');
        consoleBlock.innerText = consoleBlock.innerText + str;
      });
    }
  } else {
    return;
  }
}

async function checkIsWebPushSupported() {
  let str = '';
  if (!('Notification' in window)) {
    pushButton.textContent = 'Notification Not Supported';
    return false;
  } else if (!('serviceWorker' in navigator)) {
    pushButton.textContent = 'Service worker Not Supported';
    return false;
  } else {
    try {
      const sw = await navigator.serviceWorker.ready;
        if (!('pushManager' in sw)) {
          pushButton.textContent = 'Push Manager Not Supported';
          return false;
        }
        return true;
      } catch (error) {
        str += ('Error when check supported: ' + error + '\n');
        consoleBlock.innerText = consoleBlock.innerText + str;
        pushButton.textContent = 'Error supported';
        return false;
      }
    }
}

// get key
const getVapidPublicKey = async () => {
  const res = await fetch("/api/webpush/vapid_public_key");
  if (!res.ok) {
    let str = 'error get key';
    consoleBlock.innerText = consoleBlock.innerText + str;
    throw new Error("VAPID公開鍵取得失敗");
  }
  return (await res.json()).public_key;
};

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
  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
    serviceWorkerRegistration.pushManager.getSubscription()
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
    })
  });
  consoleBlock.innerText = consoleBlock.innerText + strConsole;
}

// Thay đổi text của button tùy thuộc vào người dùng đã đăng ký chưa
function updateBtn() {
  let strConsole = '';
  strConsole += (window.Notification.permission + '\n');
  if (window.Notification.permission === 'denied') {
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
    strConsole += ('User is subscribed\n');
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
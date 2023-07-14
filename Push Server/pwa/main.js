
// Progressive Enhancement (SW supported)
// if ('serviceWorker' in navigator) {
if (navigator.serviceWorker) {

  function urlBase64ToUint8Array(base64String){
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String+padding)
    .replace(/\-/g,'+')
    .replace(/_/g,'/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for(let i=0; i<rawData.length; ++i){
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Register the SW
  navigator.serviceWorker.register('/sw.js').then((registration) => {

    let pubKey='BIHHbD47rM37vcEWWU_SpoaLBekbRxakJtHRZniianTGlrzXWP91UraTnGKjVXOh4b97FxD_mJZfiUZxMqsP46g';

    registration.pushManager.getSubscription().then((sub) => {
      //si encuentra la suscripcion
      if(sub) return sub;

      let applicationServerKey = urlBase64ToUint8Array(pubKey);
      //suscribirse
      return registration.pushManager.subscribe({userVisibleOnly:true, applicationServerKey});
    }).then(sub => sub.toJSON())
    .then(console.log)
    .catch(console.log); 


  }).catch(console.log);

}

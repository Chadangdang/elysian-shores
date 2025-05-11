// src/serviceWorkerRegistration.ts

/* eslint-disable no-console */
/**
 * This optional code is used to register a service worker.
 * register() is not called by default.
 */

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/
      )
  );
  
  type Config = {
    onSuccess?: (registration: ServiceWorkerRegistration) => void;
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
  };
  
  export function register(config?: Config) {
    if ('serviceWorker' in navigator) {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
      if (isLocalhost) {
        // Running on localhost, check if a service worker still exists or not.
        fetch(swUrl)
          .then(response => {
            const contentType = response.headers.get('content-type');
            if (
              response.status === 404 ||
              (contentType && contentType.indexOf('javascript') === -1)
            ) {
              // No service worker found, unregister any existing.
              navigator.serviceWorker.ready.then(reg => reg.unregister());
            } else {
              // Service worker found, proceed as normal.
              registerValidSW(swUrl, config);
            }
          })
          .catch(() => console.log('No internet connection found. App is running in offline mode.'));
      } else {
        // Not localhost, just register service worker
        registerValidSW(swUrl, config);
      }
    }
  }
  
  function registerValidSW(swUrl: string, config?: Config) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');
                config?.onUpdate?.(registration);
              } else {
                console.log('Content is cached for offline use.');
                config?.onSuccess?.(registration);
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('Error during service worker registration:', error);
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    }
  }
  
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const targetUrl = (notification.data && notification.data.url) || "/";
  notification.close();

  event.waitUntil((async () => {
    const target = new URL(targetUrl, self.location.origin);
    const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

    for (const client of allClients) {
      try {
        const clientUrl = new URL(client.url);
        if (clientUrl.href === target.href || clientUrl.pathname === target.pathname) {
          if ("focus" in client) {
            return client.focus();
          }
          return client;
        }
      } catch (e) {}
    }

    if (self.clients.openWindow) {
      return self.clients.openWindow(target.href);
    }
  })());
});

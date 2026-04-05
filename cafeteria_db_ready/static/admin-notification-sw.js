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
    const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

    for (const client of allClients) {
      const clientUrl = new URL(client.url);
      const target = new URL(targetUrl, self.location.origin);

      if (clientUrl.origin === target.origin) {
        try {
          if (client.url !== target.href && "navigate" in client) {
            await client.navigate(target.href);
          }
        } catch (e) {}

        if ("focus" in client) {
          return client.focus();
        }
      }
    }

    if (self.clients.openWindow) {
      return self.clients.openWindow(targetUrl);
    }
  })());
});

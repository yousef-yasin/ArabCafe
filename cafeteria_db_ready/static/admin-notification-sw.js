self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

    for (const client of allClients) {
      try {
        const url = new URL(client.url);
        if (url.pathname.includes("adminarabcafeaau123")) {
          await client.navigate(targetUrl);
          return client.focus();
        }
      } catch (e) {}
    }

    if (allClients.length > 0) {
      try {
        await allClients[0].navigate(targetUrl);
        return allClients[0].focus();
      } catch (e) {}
    }

    if (self.clients.openWindow) {
      return self.clients.openWindow(targetUrl);
    }
  })());
});

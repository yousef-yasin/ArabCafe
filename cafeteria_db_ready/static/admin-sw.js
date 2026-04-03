self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) || client.url.includes("adminarabcafeaau123")) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});

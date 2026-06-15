/* 庄腳點貨系統 — 背景推播接收 (Firebase Cloud Messaging)
   此檔必須與 index.html 放在同一層、一起上傳到 GitHub Pages。
   路徑會是： https://tzuyingg.github.io/Jenka-Inventory/firebase-messaging-sw.js  */

importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDoSPSDr6DfQNa7DHV9Z4xl0Dkc36kd69o",
  authDomain: "jenka-inventory.firebaseapp.com",
  projectId: "jenka-inventory",
  storageBucket: "jenka-inventory.firebasestorage.app",
  messagingSenderId: "1051643046922",
  appId: "1:1051643046922:web:f0c0a053aabe88581643f3"
});

const messaging = firebase.messaging();

// 背景（App 沒開在前景）收到推播時顯示通知。
// 後端建議發「data-only」訊息（title/body 放在 data 裡），由這裡自行顯示，避免 iOS 重複跳兩則。
messaging.onBackgroundMessage(function (payload) {
  const d = (payload && (payload.data || payload.notification)) || {};
  const title = d.title || '庄腳點貨';
  self.registration.showNotification(title, {
    body: d.body || '',
    icon: 'icon192.png',
    badge: 'icon192.png',
    tag: d.tag || 'jenka-reminder',   // 同 tag 會覆蓋舊的，不會疊一堆
    data: d
  });
});

// 點通知 → 把已開啟的 App 帶到前景；沒開就開啟
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cl) {
      for (const c of cl) { if ('focus' in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

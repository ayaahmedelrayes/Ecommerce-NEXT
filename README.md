# 🛒 متجرنا — Next.js E-Commerce

مشروع متجر إلكتروني كامل بـ Next.js 14 + Mongoose + MongoDB

## 📦 التقنيات
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB + Mongoose
- **Auth:** JWT
- **Payment:** Stripe
- **Email:** Nodemailer (Gmail)
- **Push:** Web Push (VAPID)

---

## 🚀 تشغيل المشروع

### 1. تثبيت المكتبات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
```bash
cp .env.local.example .env.local
```
ثم افتح `.env.local` واملأ القيم (MongoDB, Gmail, Stripe, VAPID).

### 3. تشغيل المشروع
```bash
npm run dev
```
افتح المتصفح على: **http://localhost:3000**

---

## ⚙️ إعداد الخدمات

### MongoDB Atlas (مجاني)
1. اذهب لـ [mongodb.com/atlas](https://cloud.mongodb.com)
2. أنشئ Cluster مجاني (M0)
3. أنشئ Database User
4. احصل على Connection String وضعه في `MONGODB_URI`

### Gmail App Password
1. Google Account → Security → 2-Step Verification (فعّله)
2. App Passwords → Generate
3. ضع الباسورد في `EMAIL_PASS`

### VAPID Keys (للإشعارات)
```bash
npx web-push generate-vapid-keys
```
ضع النتيجة في `.env.local`

### Stripe (للدفع)
1. [dashboard.stripe.com](https://dashboard.stripe.com) → API Keys
2. للـ Webhook: Developers → Webhooks → Add endpoint
   - URL: `http://localhost:3000/api/payment/webhook`
   - Event: `checkout.session.completed`

---

## 👤 إنشاء حساب أدمن

بعد ما تسجّل حساب عادي، غيّر الـ role في MongoDB:

```javascript
// في MongoDB Compass أو Atlas
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "ADMIN", emailVerified: new Date() } }
)
```

أو عبر MongoDB Atlas UI:
1. Collections → users
2. ابحث عن الـ document بإيميلك
3. غيّر `role` من `"CUSTOMER"` لـ `"ADMIN"`
4. وغيّر `emailVerified` لأي تاريخ (مش null)

---

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── api/                 ← Backend (API Routes)
│   │   ├── auth/            ← register, login, verify, me
│   │   ├── products/        ← CRUD المنتجات
│   │   ├── categories/      ← CRUD التصنيفات
│   │   ├── orders/          ← إنشاء وجلب الطلبات
│   │   ├── payment/         ← Stripe + Webhook
│   │   ├── notifications/   ← Push Notifications
│   │   ├── newsletter/      ← النشرة البريدية
│   │   └── admin/           ← Stats, Users, Products
│   ├── admin/               ← لوحة الأدمن
│   ├── products/            ← عرض المنتجات
│   ├── cart/                ← السلة
│   ├── checkout/            ← الدفع
│   ├── login/ register/ verify/
│   └── layout.js
├── components/              ← Navbar, ProductCard, ...
├── context/                 ← AuthContext
├── lib/                     ← db.js, jwt.js, email.js, api.js
├── models/                  ← Mongoose Models
└── store/                   ← Zustand (Cart)
```

---

## 🃏 بطاقة Stripe للتجربة
```
رقم البطاقة: 4242 4242 4242 4242
تاريخ الانتهاء: أي تاريخ مستقبلي
CVV: أي 3 أرقام
```

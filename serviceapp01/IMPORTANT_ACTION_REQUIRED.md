# ⚠️ CRITICAL CONFIGURATION REQUIRED

The "OAuthCallback" error you are seeing is happening because your **Google Client Secret** is incorrect.

You updated the **Client ID** to the new one, but the **Client Secret** in your `.env.local` file is still the **OLD** one.

**Google Logins will FAIL until you fix this.**

## How to Fix

1.  Go to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2.  Click on the generic name of your Client ID (the one ending in `...apps.googleusercontent.com`).
3.  On the right side, you will see **"Client Secret"**.
4.  Copy that secret string (it usually starts with `GOCSPX-`).
5.  Open your project file: `serviceapp01/.env.local`
6.  Replace the value of `GOOGLE_CLIENT_SECRET` with the new one you just copied.

```env
# data in .env.local
GOOGLE_CLIENT_ID=328177443906-2ivukcr4eftieq5qqr1tp3fii3bjmnvi.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=PASTE_YOUR_NEW_SECRET_HERE  <-- CHANGE THIS
```

7.  **Restart your server** (stop it and run `npm run dev` again).

Once you do this, the `redirect_uri_mismatch` and `OAuthCallback` errors will disappear.

# Fixing Google Sign-In Error (Redirect URI Mismatch)

The error **"Error 400: redirect_uri_mismatch"** means that Google's security servers received a request from your app to return the user to a specific location (URL), but that location has not been whitelisted in your Google Cloud Console. This is a security feature to prevent attackers from stealing login tokens.

Since I cannot access your private Google account, **you must perform this step manually**.

## Step-by-Step Instructions

1.  **Open Google Cloud Console**
    *   Go to: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
    *   Ensure you are logged in with the account that created the credentials (`prathyushprathyu345@gmail.com`).

2.  **Select Your Project**
    *   If not already selected, select the project associated with your ServiceApp from the top dropdown.

3.  **Edit Credentials**
    *   Look for the section **"OAuth 2.0 Client IDs"**.
    *   Click on the name of your client ID (e.g., "Web client 1" or "ServiceApp").

4.  **Add Authorized Redirect URI**
    *   Scroll down to the section **"Authorized redirect URIs"**.
    *   check if the following URI is present. If not, click **"ADD URI"** and paste it **exactly** as shown:

    ```text
    http://localhost:3000/api/auth/callback/google
    ```

    *   *Note: Ensure there are no trailing slashes or spaces.*

5.  **Save Changes**
    *   Click the blue **SAVE** button at the bottom of the page.

## Testing
1.  Wait about **30 seconds to 2 minutes** for the changes to propagate through Google's servers.
2.  Go back to your app: [http://localhost:3000/login](http://localhost:3000/login)
3.  Click **"Sign in with Google"** again.

It should now work correctly!

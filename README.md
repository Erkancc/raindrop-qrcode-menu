Hello,

In this article, we will look at how to integrate Raindrop.io data into our website and give it a menu-like appearance. We can quickly create a menu without needing a database or additional coding.

### Working Mechanism

We create an account on Raindrop.io and add menu photos, descriptions, and pricing details. This data is retrieved via API from the service and processed with JavaScript to display it on our webpage.

### 1) Creating Raindrop.io Account

 - [Raindrop.io](https://raindrop.io/) > Login > Sign Up

### 2) Creating an API link

 - [Raindrop.io Integration](https://app.raindrop.io/settings/integrations) > For Developers > Create a New Application
 - Enter the application name (e.g., x.com) and accept the agreement
 - Generate a test token and copy it

We obtain the test token and assign it to the relevant variable.

```javascript
const accessToken = "TOKEN";
```

We assign it to the relevant variable.

### Screen Recording

https://github.com/user-attachments/assets/9b4890d3-5b64-4421-98ac-f201fc3c9c05

### Screenshot 
![QR Code Menü Raindrop](https://hasanunal.github.io/raindrop-qrcode-menu/screenshot.png?v=2)


### Bonus: QR Code Menu with Google Sheets - no code
[github/google-sheets-qrcode-menu](https://github.com/hasanunal/google-sheets-qrcode-menu)

### Bonus: Publishing
If you don't have hosting and want to publish quickly, you can use one of the following services:

- [GitHub](https://github.com/) > Create New Repo > Upload Code > Publish with GitHub Pages

- [Netlify](https://www.netlify.com/) > Create New Site > GitHub > Deploy

- [Vercel](https://vercel.com/) > Create New Site > GitHub > Deploy

Good luck. 🚀
*[hasanunal.org](https://hasanunal.org/)*

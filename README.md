# Valentine Website 2026

Make a cute, interactive Valentine site in minutes. No coding required after setup.

## Quick Start (3 steps)
1. Replace your photos:
   - `assets/photo.jpg` (main photo)
   - `assets/pair-1.jpg`, `assets/pair-2.jpg`, `assets/pair-3.jpg` (match game)
2. Edit `config.js`:
   - Name, messages, and city pairs
3. Deploy (GitHub Pages or Netlify)

---

## Customization Cheatsheet

Open `config.js` and edit:

- `valentineName`
- `photoPath`
- `heroMessage`
- `questionText`
- `yesMessage`
- `noMessages`
- `games.match.pairs` (your photos + cities)
- `final.title`, `final.message`, `final.subtext`, `final.emojis`

You do **not** need to change `index.html` or `script.js`.

---

## Email Setup (EmailJS)

1. Create an account on EmailJS.
2. Create an email service.
3. Create an email template with these fields:
   - `to_email`
   - `valentine_name`
   - `message`
4. Copy your:
   - Service ID
   - Template ID
   - Public Key
5. Paste them in `config.js`:
   - `email.serviceId`
   - `email.templateId`
   - `email.publicKey`
   - `email.toEmail`

If you don’t want email notifications, set:

```js
email: {
  enabled: false
}
```

---

## Deploy Options

### GitHub Pages
1. Push this repo to GitHub.
2. Go to Settings → Pages.
3. Choose the `main` branch and `/ (root)` folder.
4. Save and wait for the URL.

### Netlify (Drag & Drop)
1. Zip the folder.
2. Drop it into Netlify.
3. Done.

---

## Notes

- Replace the placeholder images in `assets/`.
- The site is 100% static and works offline.

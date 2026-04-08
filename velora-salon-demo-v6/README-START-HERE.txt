VELORA SALON DEMO PREVIEW V6
========================

WHAT THIS VERSION ADDS
- The real template only (no demo folder in this package)
- A rebuilt owner panel inspired by the Rowan & Vale reference controls
- Cleaner tabbed editing for brand, copy, colors, images, services, gallery, and backup settings
- Monkey toggle on the owner password fields
- Upload support inside the owner panel for the major image areas, services, and gallery items
- Settings download / upload so buyers can back up their changes
- Passcode change option inside the owner panel

PAGES INCLUDED
1. index.html
2. about.html
3. services.html
4. gallery.html
5. contact.html
6. owner.html

BEST WAY TO EDIT
OPTION 1 (FASTEST FOR MOST BUYERS)
- Open owner.html
- Default passcode: preview
- Make changes in the owner panel
- Click Save preview changes
- Open the site pages to see those changes in that browser
- Download the settings file as a backup when you are done

OPTION 2 (MOST PERMANENT)
- Open content.js
- Change the default text, links, colors, image paths, and form settings there
- Save the file

IMPORTANT OWNER PANEL NOTE
- The owner panel is still front-end only
- It saves preview changes in the browser using localStorage
- The downloaded settings file is the backup for those edits
- If a buyer wants the changed content to ship as the new default, they should also update content.js

FORM SETUP
- The contact form works in mailto mode by default
- It can also be switched to endpoint mode later using FormSubmit, Formspree, Netlify Forms, or another service
- See FORM-SETUP.txt for the simple steps

BOOKING SETUP
- The booking buttons can point to contact.html
- Or they can point to Fresha, Square, GlossGenius, Vagaro, Calendly, or another booking page

IMAGE NOTES
- Buyers can still swap normal image files in assets/images
- The owner panel can also save uploaded images directly into the preview settings file
- For the lightest final package, regular image files in assets/images are still the best long-term method


OWNER ACCESS
- Every public page now includes a floating Owner button in the lower-right corner.
- You can also open owner.html directly.
- Default passcode: preview


SOCIAL MEDIA LINKS
- Open owner.html.
- Use the General section.
- Paste the full Instagram, Facebook, Pinterest, TikTok, or YouTube links.
- The header and footer will only show the social buttons for links that are filled in.
- Leave any social field blank and that button stays hidden.


DEMO TWIN NOTES
- This is the demo preview build for JasonsWebPages.com.
- The owner entry screen still appears so buyers can see the owner flow.
- In this demo build, the passcode does not actually block access. Click Unlock panel to open it.
- The footer includes the Jason'sWebPages logo button that links back to https://jasonswebpages.com.
- Demo changes save in this browser only.

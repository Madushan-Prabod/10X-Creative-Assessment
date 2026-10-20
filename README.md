# Performance Landing Page & Data Layer Integration

A responsive, performance-focused landing page developed as part of the 10X Creative technical assessment. The project demonstrates custom frontend development, lead form interaction, JavaScript data layer tracking, and Git-based version control.

## Overview

The landing page is designed to provide a clean, modern user experience across desktop, tablet, and mobile devices. It includes a hero section, feature highlights, an interactive lead capture form, and a call-to-action section.

## Features

- Responsive, mobile-friendly layout
- Custom HTML, CSS, and JavaScript implementation
- Hero section and feature highlights
- Interactive lead capture form
- Client-side form validation
- Custom `window.dataLayer` event tracking
- Timestamped lead submission events
- GitHub version control and deployment-ready structure

## Technology Stack

- **HTML5** — Page structure and content
- **CSS3** — Styling and responsive layout
- **JavaScript** — Form handling, validation, and tracking integration
- **GSAP** — Animation 
- **ScrollTrigger** — Animation 
- **Responsive web design**
- **SEO meta tags**
- **Git & GitHub** — Version control and source code management
- **Netlify** — Static website deployment


## Project Structure

```text
10X-Creative-Assessment/
├── images/
├── index.html
├── style.css
├── script.js
└── README.md
```

*Note: Update the filenames above if your project uses different names or additional assets.*

## Tracking Implementation

When the lead form is submitted successfully on the client side, the following event is pushed to `window.dataLayer`:

```javascript
window.dataLayer.push({
  event: 'lead_form_submitted',
  form_id: 'hero_lead_form',
  user_data: {
    name: name,
    email: email
  },
  timestamp: new Date().toISOString()
});
```

The event includes the event name, form identifier, submitted name and email, and an ISO-formatted timestamp.

### Testing the Tracking Event

1. Open the landing page in your browser.
2. Open Developer Tools and select the Console tab.
3. Submit the lead form using valid test details.
4. Run the following command:

```javascript
window.dataLayer.filter(
  item => item.event === 'lead_form_submitted'
);
```

5. Confirm that the event and expected fields appear in the returned result.

**Note:** The current demonstration uses client-side tracking. It does not store leads in a database or send emails unless a backend service is added. Personal data should not be forwarded to Google Analytics or advertising analytics platforms.

## Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Madushan-Prabod/10X-Creative-Assessment.git
   ```

2. Open the project folder:

   ```bash
   cd 10X-Creative-Assessment
   ```

3. Open `index.html` in your browser, or use the VS Code Live Server extension.

4. Test the form and verify the tracking event in Developer Tools.

## Deployment

The project can be deployed as a static website using Netlify or Vercel.

For a static deployment, configure the project root as the publish directory if `index.html` is located there. No build command is required for a plain HTML, CSS, and JavaScript project.

## Assessment Deliverables

- GitHub repository containing the source code
- Responsive landing page
- Custom lead form tracking implementation
- README documentation
- Live staging URL for review

## Author

**Madushan Prabod**

Developed as part of the 10X Creative technical assessment.

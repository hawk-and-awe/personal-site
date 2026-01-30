# Chris Hawk - Motion Designer Portfolio

A modern, animated portfolio website built with Astro and Tailwind CSS.

## Features

- Modern, dark-themed design optimized for showcasing motion design work
- Smooth scroll animations and micro-interactions
- Lottie animation support for showcasing animation skills
- Responsive design that works on all devices
- Fast loading with Astro's static site generation
- SEO optimized

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

### Adding Your Lottie Animations

1. Export your animations from After Effects using the Bodymovin/LottieFiles plugin
2. Place the `.json` animation files in `/public/animations/`
3. Update the Lottie containers in the pages:

```javascript
import lottie from 'lottie-web';

lottie.loadAnimation({
  container: document.getElementById('lottie-avatar'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: '/animations/your-animation.json'
});
```

### Adding Video Embeds

In `/src/pages/work.astro`, update the `videoUrl` for each project:

```javascript
{
  id: 'project-name',
  videoUrl: 'https://player.vimeo.com/video/YOUR_VIDEO_ID',
  // ... other fields
}
```

### Updating the Contact Form

The contact form uses Formspree. To set it up:

1. Create a free account at [Formspree](https://formspree.io)
2. Create a new form and copy the form ID
3. Update the form action in `/src/pages/contact.astro`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Adding Your Resume PDF

Place your resume PDF in the `/public/` folder as `chris-hawk-resume.pdf`.

## Project Structure

```
/
├── public/
│   ├── animations/     # Lottie animation JSON files
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── layouts/
│   │   └── Layout.astro    # Main layout with nav & footer
│   ├── pages/
│   │   ├── index.astro     # Home page
│   │   ├── work.astro      # Portfolio/projects page
│   │   ├── resume.astro    # Resume/experience page
│   │   └── contact.astro   # Contact form page
│   └── styles/
│       └── global.css      # Global styles & Tailwind
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Deployment

This site can be deployed to any static hosting platform:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder or connect GitHub
- **Cloudflare Pages**: Connect your GitHub repo

### Build Command

```bash
npm run build
```

### Output Directory

```
dist/
```

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Lottie](https://lottiefiles.com) - Animation library

## License

Personal portfolio - All rights reserved.

/**
 * Site-wide settings. Edit this file to update your details everywhere at once.
 */
export const site = {
  name: 'Chris Hawk',
  role: 'Motion Designer & Video Producer',
  tagline: 'I help ideas take flight.',
  description:
    'Chris Hawk is a motion designer and video producer in Oklahoma City — animation, live-action production and post for brands that need their story told well.',
  url: 'https://www.chrishawk.net',
  location: 'Oklahoma City, OK',
  email: 'hawk@chrishawk.net',

  /** The hawk illustration used across the site: 'perched' (on a film reel) or 'flight'. */
  hawk: 'perched' as 'perched' | 'flight',

  /** Shown in the header and hero. Set `open: false` to hide the badge. */
  availability: { open: true, label: 'Open to new roles' },

  /** Résumé PDF. Drop a file at /public/chris-hawk-resume.pdf and point this at it to self-host. */
  resumeUrl: 'https://drive.google.com/file/d/1Dq8iFvgDaTRc0oL8pTU17IQr2PbY0T9O/view?usp=sharing',

  /**
   * Optional form backend (e.g. a Formspree endpoint like https://formspree.io/f/abcdwxyz).
   * Leave empty and the contact form opens the visitor's email app instead.
   */
  contactFormEndpoint: '',

  socials: [
    { label: 'Instagram', handle: '@vodhawk', href: 'https://www.instagram.com/vodhawk' },
    // { label: 'LinkedIn', handle: 'in/your-handle', href: 'https://www.linkedin.com/in/your-handle' },
    // { label: 'Vimeo', handle: 'vimeo.com/you', href: 'https://vimeo.com/user168849102' },
  ],

  /** The headline reel. `loop` is the short muted clip behind the hero; `video` is the full cut with sound. */
  reel: {
    title: 'Demo Reel',
    year: 2022,
    loop: '/media/reel-loop.mp4',
    video: { provider: 'vimeo', id: '685534017', hash: 'edabc44f4b', duration: 69 },
  },

  nav: [
    { label: 'Work', href: '/work' },
    { label: 'Reel', href: '/reel' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    // { label: 'Stills', href: '/stills' }, — hidden for now; see README to bring it back.
  ],
} as const;

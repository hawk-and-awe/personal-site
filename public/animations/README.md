# Lottie Animations

Place your Lottie animation JSON files in this folder.

## How to Export from After Effects

1. Install the **Bodymovin** plugin for After Effects
   - Download from: https://aescripts.com/bodymovin/
   - Or install via Window > Extensions > Bodymovin

2. In After Effects, go to Window > Extensions > Bodymovin

3. Select your composition and choose output settings:
   - Standard export for web animations
   - Enable "Glyphs" if using text
   - Use "Demo" to preview before export

4. Click "Render" to export the JSON file

5. Place the exported `.json` file in this folder

## Example Files to Add

- `avatar.json` - Your animated avatar/head illustration
- `hero-background.json` - Background animation for hero section
- `loading.json` - Loading spinner animation
- `success.json` - Success state animation for forms

## Using in the Website

In any Astro page, add:

```html
<script>
  import lottie from 'lottie-web';

  document.addEventListener('DOMContentLoaded', () => {
    lottie.loadAnimation({
      container: document.getElementById('your-container-id'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/animations/your-animation.json'
    });
  });
</script>
```

## Resources

- [LottieFiles](https://lottiefiles.com) - Free animations & tools
- [Bodymovin Documentation](https://airbnb.io/lottie/)
- [After Effects to Lottie Guide](https://lottiefiles.com/blog/working-with-lottie/after-effects-guide-to-export-lottie)

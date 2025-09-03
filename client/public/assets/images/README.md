# Images Folder

Place your image assets here:

- Logo files
- Hero images  
- Feature icons
- Profile pictures
- Background images

## Usage in components:

```jsx
import Image from 'next/image'

<Image 
  src="/assets/images/logo.png" 
  alt="Logo" 
  width={200} 
  height={100} 
/>
```

Or with regular img tag:
```jsx
<img src="/assets/images/hero.jpg" alt="Hero" />
```
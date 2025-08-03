# 🎨🎨🎨 unocss-preset-button-painter

A UnoCSS preset that dynamically generates button color utilities based on your theme's color configuration. It creates solid and ghost button styles with smart text contrast and hover/focus states, complete with autocomplete support.

**Probably don't use this unless you are pop open the rules in the preset and understand what it is doing. It is not very useful unless used with additional base CSS**

## Installation

https://www.npmjs.com/package/unocss-preset-button-painter

```bash
npm install unocss-preset-button-painter
```

## Usage

Add the preset to your UnoCSS configuration:

```js
import { defineConfig, presetUno } from 'unocss'
import { presetButtonPainter } from 'unocss-preset-button-painter'

export default defineConfig({
  presets: [
    presetUno(),
    presetButtonPainter()
  ]
})
```

## Features

- **Dynamic Button Styles**: Generates `.button-{color}-{shade}` for solid buttons and `.button-ghost-{color}-{shade}` for outline/ghost buttons based on your theme's colors.
- **Smart Text Contrast**: Automatically selects dark or light text based on the background shade for optimal readability.
- **Hover/Focus States**: Ghost buttons include hover and focus states with appropriate background and text color transitions.
- **Autocomplete Support**: Provides autocompletion for button classes in supported editors (e.g., `button-primary-500`, `button-ghost-blue-600`).
- **Size Variants**: Includes shorthand for button sizes (`button`, `button-small`, `button-medium`, `button-large`).

## Example

Assuming your theme defines a `primary` color with shades (e.g., `primary.500`, `primary.900`), you can use:

```html
<button class="button-primary-500">Solid Button</button>
<button class="button-ghost-primary-500">Ghost Button</button>
```

This will generate:
- A solid button with a `primary-500` background, appropriate text color, and matching border.
- A ghost button with a transparent background, `primary-500` border and text, and a hover state with a `primary-500` background and contrasting text.

## Notes

- Ensure your UnoCSS theme includes a `colors` object with named colors and shades (e.g., `{ primary: { 500: '#3B82F6', 900: '#1E3A8A' } }`).
- This preset is best suited for projects with custom theming needs. Familiarize yourself with its functionality before using it in production.

## License

MIT

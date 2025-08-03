/**
 * UnoCSS Button Color Preset
 * 
 * Dynamically generates button color utilities from your UnoCSS theme.
 * Works with both custom colors and all standard Tailwind colors.
 * 
 * @example
 * ```js
 * import { presetButtonPainter } from 'unocss-preset-button-painter'
 * 
 * export default defineConfig({
 *   presets: [
 *     presetUno(),
 *     presetButtonPainter()
 *   ]
 * })
 * ```
 * 
 * Generates:
 * - `.button-{color}-{shade}` - Solid buttons (e.g., button-primary-500)
 * - `.button-ghost-{color}-{shade}` - Ghost/outline buttons (e.g., button-ghost-blue-600)
 * 
 * Features:
 * - Smart text contrast (dark text on light backgrounds, light text on dark)
 * - Hover/focus states for ghost buttons
 * - Full autocomplete support
 * - Works with any color in your theme
 * 
 * @returns {import('@unocss/core').Preset} UnoCSS preset
 */

// Utility function to flatten color palette (similar to the working example)
const flattenColorPalette = (colors) => Object.assign({}, ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
    typeof values == "object"
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === "DEFAULT" ? "" : `-${number}`)]: hex
        }))
        : [{ [`${color}`]: values }]
));

export function presetButtonPainter() {
    return {
        name: 'unocss-preset-button-painter',
        
        // Pre-compute color combinations for autocomplete
        extendTheme: (theme) => {
            const flatColors = flattenColorPalette(theme.colors);
            const colorKeys = Object.keys(flatColors);
            
            // Extract unique color names and shades for autocomplete
            const colorNames = new Set();
            const shades = new Set();
            
            colorKeys.forEach(key => {
                const match = key.match(/^([a-zA-Z-]+)-?(\d+)?$/);
                if (match) {
                    colorNames.add(match[1]);
                    if (match[2]) {
                        shades.add(match[2]);
                    }
                }
            });
            
            return {
                ...theme,
                _buttonColors: Array.from(colorNames),
                _buttonShades: Array.from(shades)
            };
        },
    
        rules: [
            // Solid button variations: .button-{color}-{shade}
            [
                /^button-([\w-]+)-(\d+)$/,
                ([, colorName, shade], { theme }) => {
                    const colors = theme.colors || {}
                    const colorGroup = colors[colorName]
                    if (!colorGroup || !colorGroup[shade]) {
                        return undefined
                    }
                    
                    const bgColor = colorGroup[shade]
                    const borderColor = bgColor
                    
                    // Smart text color based on shade
                    const shadeNum = parseInt(shade)
                    let textColor
                    
                    if (shadeNum <= 400) {
                        // Light shades - use dark text
                        textColor = colors.primary?.[900] || colors.gray?.[900] || '#000000'
                    } else {
                        // Dark shades - use light text  
                        textColor = colors.secondary?.[100] || colors.gray?.[100] || '#ffffff'
                    }
                    
                    return {
                        'color': textColor,
                        'border-color': borderColor,
                        'background-color': bgColor,
                    }
                },
                { 
                    autocomplete: [
                        'button-$colors',
                        'button-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|gray|slate|zinc|neutral|stone)-(50|100|200|300|400|500|600|700|800|900|950)',
                        'button-<color>-<num>'
                    ]
                }
            ],
            
            // Ghost button variations: .button-ghost-{color}-{shade}
            [
                /^button-ghost-([\w-]+)-(\d+)$/,
                ([, colorName, shade], { theme, rawSelector }) => {
                    const colors = theme.colors || {}
                    const colorGroup = colors[colorName]
                    if (!colorGroup || !colorGroup[shade]) {
                        return undefined
                    }
                    
                    const borderColor = colorGroup[shade]
                    const textColor = borderColor
                    
                    // Smart hover text color based on shade
                    const shadeNum = parseInt(shade)
                    let hoverTextColor
                    
                    if (shadeNum <= 400) {
                        // Light hover backgrounds - use dark text
                        hoverTextColor = colors.primary?.[900] || colors.gray?.[900] || '#000000'
                    } else {
                        // Dark hover backgrounds - use light text
                        hoverTextColor = colors.secondary?.[100] || colors.gray?.[100] || '#ffffff'
                    }
                    
                    // Use CSS string format to properly handle hover/focus
                    return `
                        .${rawSelector} {
                            color: ${textColor};
                            border-color: ${borderColor};
                            background-color: transparent;
                        }
                        .${rawSelector}:hover,
                        .${rawSelector}:focus {
                            background-color: ${borderColor};
                            border-color: ${borderColor};
                            color: ${hoverTextColor};
                        }
                    `
                },
                { 
                    autocomplete: [
                        'button-ghost-$colors',
                        'button-ghost-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|gray|slate|zinc|neutral|stone)-(50|100|200|300|400|500|600|700|800|900|950)',
                        'button-ghost-<color>-<num>'
                    ]
                }
            ]
        ]
    }
}

// Default export for convenience
export default presetButtonPainter
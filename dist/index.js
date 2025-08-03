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
export function presetButtonPainter() {
    return {
        name: 'unocss-preset-button-painter',
        
        // Smart autocomplete templates
        autocomplete: {
            templates: [
                'button-$colors-<num>',                   // button-primary-500
                'button-ghost-$colors-<num>',             // button-ghost-primary-500
            ],
            shorthands: {
                // Base button size classes
                'button-size': ['button', 'button-small', 'button-medium', 'button-large']
            }
        },
        
        rules: [
            // Solid button variations: .button-{color}-{shade}
            [
                /^button-([a-z]+)-(\d+)$/,
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
                { autocomplete: ['button-$colors-<num>', 'button-$colors-(50|100|200|300|400|500|600|700|800|900)'] }
            ],
            
            // Ghost button variations: .button-ghost-{color}-{shade}
            [
                /^button-ghost-([a-z]+)-(\d+)$/,
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
                { autocomplete: ['button-ghost-$colors-<num>', 'button-ghost-$colors-(50|100|200|300|400|500|600|700|800|900)'] }
            ]
        ]
    }
}

// Default export for convenience
export default presetButtonPainter

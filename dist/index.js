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
 * 
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
                { autocomplete: ['button-$colors'] }
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
                { autocomplete: ['button-ghost-$colors'] }
            ],
            // JIT Solid button variations: .button-[arbitrary-value]
            [
                /^button-\[(.+)\]$/,
                ([, arbitraryValue], { theme }) => {
                    const colors = theme.colors || {}
                    
                    // Smart contrast detection for arbitrary colors
                    function getContrastColor(color) {
                        // Parse different color formats and calculate luminance
                        let r, g, b
                        
                        // Hex format (#rgb or #rrggbb)
                        if (color.startsWith('#')) {
                            const hex = color.slice(1)
                            if (hex.length === 3) {
                                r = parseInt(hex[0] + hex[0], 16)
                                g = parseInt(hex[1] + hex[1], 16)
                                b = parseInt(hex[2] + hex[2], 16)
                            } else if (hex.length === 6) {
                                r = parseInt(hex.slice(0, 2), 16)
                                g = parseInt(hex.slice(2, 4), 16)
                                b = parseInt(hex.slice(4, 6), 16)
                            }
                        }
                        // RGB/RGBA format
                        else if (color.startsWith('rgb')) {
                            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                            if (match) {
                                r = parseInt(match[1])
                                g = parseInt(match[2])
                                b = parseInt(match[3])
                            }
                        }
                        
                        // If we successfully parsed RGB values, calculate luminance
                        if (r !== undefined && g !== undefined && b !== undefined) {
                            // Convert to relative values (0-1) and apply gamma correction
                            const rRel = (r / 255) <= 0.03928 ? (r / 255) / 12.92 : Math.pow(((r / 255) + 0.055) / 1.055, 2.4)
                            const gRel = (g / 255) <= 0.03928 ? (g / 255) / 12.92 : Math.pow(((g / 255) + 0.055) / 1.055, 2.4)
                            const bRel = (b / 255) <= 0.03928 ? (b / 255) / 12.92 : Math.pow(((b / 255) + 0.055) / 1.055, 2.4)
                            
                            // Calculate relative luminance using WCAG formula
                            const luminance = 0.2126 * rRel + 0.7152 * gRel + 0.0722 * bRel
                            
                            // Choose text color based on luminance
                            if (luminance > 0.5) {
                                // Light background - use dark text
                                return colors.primary?.[900] || colors.gray?.[900] || '#000000'
                            } else {
                                // Dark background - use light text
                                return colors.secondary?.[100] || colors.gray?.[100] || '#ffffff'
                            }
                        }
                        
                        // Fallback to white text for unparseable colors (css vars, hsl, etc.)
                        return colors.secondary?.[100] || colors.gray?.[100] || '#ffffff'
                    }
                    
                    const textColor = getContrastColor(arbitraryValue)
                    
                    return {
                        'color': textColor,
                        'border-color': arbitraryValue,
                        'background-color': arbitraryValue,
                    }
                },
            ],
            // JIT Ghost button variations: .button-ghost-[arbitrary-value]
            [
                /^button-ghost-\[(.+)\]$/,
                ([, arbitraryValue], { theme, rawSelector }) => {
                    const colors = theme.colors || {}
                    
                    // Smart contrast detection for arbitrary colors (same as solid buttons)
                    function getContrastColor(color) {
                        let r, g, b
                        
                        // Hex format (#rgb or #rrggbb)
                        if (color.startsWith('#')) {
                            const hex = color.slice(1)
                            if (hex.length === 3) {
                                r = parseInt(hex[0] + hex[0], 16)
                                g = parseInt(hex[1] + hex[1], 16)
                                b = parseInt(hex[2] + hex[2], 16)
                            } else if (hex.length === 6) {
                                r = parseInt(hex.slice(0, 2), 16)
                                g = parseInt(hex.slice(2, 4), 16)
                                b = parseInt(hex.slice(4, 6), 16)
                            }
                        }
                        // RGB/RGBA format
                        else if (color.startsWith('rgb')) {
                            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                            if (match) {
                                r = parseInt(match[1])
                                g = parseInt(match[2])
                                b = parseInt(match[3])
                            }
                        }
                        
                        // If we successfully parsed RGB values, calculate luminance
                        if (r !== undefined && g !== undefined && b !== undefined) {
                            // Convert to relative values (0-1) and apply gamma correction
                            const rRel = (r / 255) <= 0.03928 ? (r / 255) / 12.92 : Math.pow(((r / 255) + 0.055) / 1.055, 2.4)
                            const gRel = (g / 255) <= 0.03928 ? (g / 255) / 12.92 : Math.pow(((g / 255) + 0.055) / 1.055, 2.4)
                            const bRel = (b / 255) <= 0.03928 ? (b / 255) / 12.92 : Math.pow(((b / 255) + 0.055) / 1.055, 2.4)
                            
                            // Calculate relative luminance using WCAG formula
                            const luminance = 0.2126 * rRel + 0.7152 * gRel + 0.0722 * bRel
                            
                            // Choose text color based on luminance
                            if (luminance > 0.5) {
                                // Light background - use dark text
                                return colors.primary?.[900] || colors.gray?.[900] || '#000000'
                            } else {
                                // Dark background - use light text
                                return colors.secondary?.[100] || colors.gray?.[100] || '#ffffff'
                            }
                        }
                        
                        // Fallback to white text for unparseable colors (css vars, hsl, etc.)
                        return colors.secondary?.[100] || colors.gray?.[100] || '#ffffff'
                    }
                    
                    const hoverTextColor = getContrastColor(arbitraryValue)
                    
                    // Use CSS string format to properly handle hover/focus
                    return `
                        .${rawSelector} {
                            color: ${arbitraryValue};
                            border-color: ${arbitraryValue};
                            background-color: transparent;
                        }
                        .${rawSelector}:hover,
                        .${rawSelector}:focus {
                            background-color: ${arbitraryValue};
                            border-color: ${arbitraryValue};
                            color: ${hoverTextColor};
                        }
                    `
                },
            ]
        ]
    }
}

// Default export for convenience
export default presetButtonPainter

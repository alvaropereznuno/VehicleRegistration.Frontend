function getCssColor(color, alpha = 1) {
    const rootStyles = getComputedStyle(document.documentElement);
    const colorAccent = rootStyles.getPropertyValue(color).trim();

    // Convertir a RGB
    let bigint = parseInt(colorAccent.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    return rgbaColor;
}

const Colors = {
    primary: function (alpha = 1) {
        return getCssColor('--COLOR-PRIMARY', alpha);
    },
    secondary: function (alpha = 1) {
        return getCssColor('--COLOR-SECONDARY', alpha);
    },
    accent: function (alpha = 1) {
        return getCssColor('--COLOR-ACCENT', alpha);
    },
    accentDark: function (alpha = 1) {
        return getCssColor('--COLOR-ACCENT-DARK', alpha);
    },
    separator: function (alpha = 1) {
        return getCssColor('--COLOR-SEPARATOR', alpha);
    },
}

export default Colors;
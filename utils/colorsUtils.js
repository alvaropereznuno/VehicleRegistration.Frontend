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
    
    type_1: function (alpha = 1) {
        return getCssColor('--COLOR-TYPE-1', alpha);
    },
    type_2: function (alpha = 1) {
        return getCssColor('--COLOR-TYPE-2', alpha);
    },
    type_3: function (alpha = 1) {
        return getCssColor('--COLOR-TYPE-3', alpha);
    },
    type_4: function (alpha = 1) {
        return getCssColor('--COLOR-TYPE-4', alpha);
    },
    type_5: function (alpha = 1) {
        return getCssColor('--COLOR-TYPE-5', alpha);
    },
    type_6: function (alpha = 1) {
        return getCssColor('--COLOR-TYPE-6', alpha);
    },
    type_7: function (alpha = 1) {
        return getCssColor('--COLOR-TYPE-7', alpha);
    },
    type_8: function (alpha = 1) {
        return getCssColor('--COLOR-TYPE-8', alpha);
    }
}

export default Colors;
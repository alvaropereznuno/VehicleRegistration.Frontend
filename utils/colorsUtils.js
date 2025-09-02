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
    },

    getPropulsionColor: function (motorTypeId, alpha = 1) {
        switch (motorTypeId) {
            case '1':
            case 'Gasolina':
                return this.type_1(alpha);
            case '2':
            case 'Diesel':
                return this.type_2(alpha);
            case '3':
            case 'Gas':
                return this.type_3(alpha);
            case '4':
            case 'Híbrido':
                return this.type_4(alpha);
            case '5':
            case 'Híbrido Enchufable':
                return this.type_5(alpha);
            case '6':
            case 'Eléctrico 100%':
                return this.type_6(alpha);
            case '7':
            case '':
                return this.type_7(alpha);
            case '8':
            case '':
                return this.type_8(alpha);
            default:
                return this.primary(alpha); // Default color if type is not recognized
        }
    }
}

export default Colors;
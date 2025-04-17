// dict.js

const DICT = {
    // Motor types
    MOTOR_TYPES: [
        { id: 1,    code: "C",      description: "Combustión" },
        { id: 2,    code: "HEV",    description: "Híbrido" },
        { id: 3,    code: "PHEV",   description: "Híbrido Enchufable" },
        { id: 4,    code: "BEV",    description: "100% Eléctrico" },
        { id: 5,    code: "FCEV",   description: "Hidrógeno" }
    ],

    // Vehicle types
    VEHICLE_TYPES: [
        { id: 1,    code: "20",     description: "Furgoneta" },
        { id: 2,    code: "21",     description: "Furgoneta Mixta" },
        { id: 3,    code: "25",     description: "Todo Terreno" },
        { id: 4,    code: "40",     description: "Turismo" },
        { id: 5,    code: "60",     description: "Coche de inválido" }
    ],

    // Communities
    COMMUNITIES: [
        { id: 1,    description: "Andalucía" },
        { id: 2,    description: "Castilla La Mancha" },
        { id: 3,    description: "Extremadura" },
        { id: 4,    description: "Comunidad Valenciana" },
        { id: 5,    description: "Comunidad de Madrid" },
        { id: 6,    description: "Castilla y León" },
        { id: 7,    description: "Aragón" },
        { id: 8,    description: "Cataluña" },
        { id: 9,    description: "Galicia" },
        { id: 10,   description: "Asturias" },
        { id: 11,   description: "Cantabria" },
        { id: 12,   description: "País Vasco" },
        { id: 13,   description: "Navarra" },
        { id: 14,   description: "Región de Murcia" },
        { id: 15,   description: "La Rioja" },
        { id: 16,   description: "Islas Baleares" },
        { id: 17,   description: "Islas Canarias" },
        { id: 18,   description: "Ceuta" },
        { id: 19,   description: "Melilla" },
        { id: 20,   description: "Desconocido" }
    ],

    // Provinces
    PROVINCES: [
        { id: 1,    code: "A",  description: "Alicante / Alacant",      communityId: 4 },
        { id: 2,    code: "AB", description: "Albacete",                communityId: 2 },
        { id: 3,    code: "AL", description: "Almería",                 communityId: 1 },
        { id: 4,    code: "AV", description: "Ávila",                   communityId: 6 },
        { id: 5,    code: "B",  description: "Barcelona",               communityId: 8 },
        { id: 6,    code: "BA", description: "Badajoz",                 communityId: 3 },
        { id: 7,    code: "BI", description: "Bizkaia",                 communityId: 12 },
        { id: 8,    code: "BU", description: "Burgos",                  communityId: 6 },
        { id: 9,    code: "C",  description: "A Coruña",                communityId: 9 },
        { id: 10,   code: "CA", description: "Cádiz",                   communityId: 1 },
        { id: 11,   code: "CC", description: "Cáceres",                 communityId: 3 },
        { id: 12,   code: "CE", description: "Ceuta",                   communityId: 18 },
        { id: 13,   code: "CO", description: "Córdoba",                 communityId: 1 },
        { id: 14,   code: "CR", description: "Ciudad Real",             communityId: 2 },
        { id: 15,   code: "CS", description: "Castellón / Castelló",    communityId: 4 },
        { id: 16,   code: "CU", description: "Cuenca",                  communityId: 2 },
        { id: 17,   code: "DS", description: "Desconocido",             communityId: 20 },
        { id: 18,   code: "EX", description: "Extranjero",              communityId: 20 },
        { id: 19,   code: "GC", description: "Las Palmas",              communityId: 17 },
        { id: 20,   code: "GI", description: "Girona",                  communityId: 8 },
        { id: 21,   code: "GR", description: "Granada",                 communityId: 1 },
        { id: 22,   code: "GU", description: "Guadalajara",             communityId: 2 },
        { id: 23,   code: "H",  description: "Huelva",                  communityId: 1 },
        { id: 24,   code: "HU", description: "Huesca",                  communityId: 7 },
        { id: 25,   code: "J",  description: "Jaén",                    communityId: 1 },
        { id: 26,   code: "L",  description: "Lleida",                  communityId: 8 },
        { id: 27,   code: "LE", description: "León",                    communityId: 6 },
        { id: 28,   code: "LO", description: "La Rioja",                communityId: 15 },
        { id: 29,   code: "LU", description: "Lugo",                    communityId: 9 },
        { id: 30,   code: "M",  description: "Madrid",                  communityId: 5 },
        { id: 31,   code: "MA", description: "Málaga",                  communityId: 1 },
        { id: 32,   code: "ML", description: "Melilla",                 communityId: 19 },
        { id: 33,   code: "MU", description: "Murcia",                  communityId: 14 },
        { id: 34,   code: "NA", description: "Navarra",                 communityId: 13 },
        { id: 35,   code: "O",  description: "Asturias",                communityId: 10 },
        { id: 36,   code: "OU", description: "Orense",                  communityId: 9 },
        { id: 37,   code: "P",  description: "Palencia",                communityId: 6 },
        { id: 38,   code: "IB", description: "Baleares",                communityId: 16 },
        { id: 39,   code: "PO", description: "Pontevedra",              communityId: 9 },
        { id: 40,   code: "S",  description: "Cantabria",               communityId: 11 },
        { id: 41,   code: "SA", description: "Salamanca",               communityId: 6 },
        { id: 42,   code: "SE", description: "Sevilla",                 communityId: 1 },
        { id: 43,   code: "SG", description: "Segovia",                 communityId: 6 },
        { id: 44,   code: "SO", description: "Soria",                   communityId: 6 },
        { id: 45,   code: "SS", description: "Gipuzkoa",                communityId: 12 },
        { id: 46,   code: "T",  description: "Tarragona",               communityId: 8 },
        { id: 47,   code: "TE", description: "Teruel",                  communityId: 7 },
        { id: 48,   code: "TF", description: "Santa Cruz de Tenerife",  communityId: 17 },
        { id: 49,   code: "TO", description: "Toledo",                  communityId: 2 },
        { id: 50,   code: "V",  description: "Valencia / València",     communityId: 4 },
        { id: 51,   code: "VA", description: "Valladolid",              communityId: 6 },
        { id: 52,   code: "VI", description: "Álava / Araba",           communityId: 12 },
        { id: 53,   code: "Z",  description: "Zaragoza",                communityId: 7 },
        { id: 54,   code: "ZA", description: "Zamora",                  communityId: 6 },
    ]
};

export default DICT;
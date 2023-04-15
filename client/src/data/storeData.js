import { ColorsGreen,  ColorsTile, 
     ColorsOrange, ColorsRed, ColorsPurple, 
    ColorsDarkerBlue, ColorsLightBlue, ColorsDarkerOrange, ColorsDarkerRed, 
    ColorsDarkerPurple, 
    ColorsBlue} from "../constants/palet";


function convertColorObjectToArray(colorObject) {
  return Object.entries(colorObject).map(([name, hex]) => {
    return hex;

  });
}

// orange, red, purple, blue, green
const ColorOrange = convertColorObjectToArray(ColorsOrange);
const ColorDarkerOrange = convertColorObjectToArray(ColorsDarkerOrange);
const ColorRed = convertColorObjectToArray(ColorsRed);
const ColorDarkerRed = convertColorObjectToArray(ColorsDarkerRed);
const ColorPurple = convertColorObjectToArray(ColorsPurple);
const ColorDarkerPurple = convertColorObjectToArray(ColorsDarkerPurple);
const ColorBlue = convertColorObjectToArray(ColorsLightBlue);
const ColorDarkerBlue = convertColorObjectToArray(ColorsDarkerBlue);
const ColorGreen = convertColorObjectToArray(ColorsGreen);


export const speedData = 
[
        {
            iconColor: ColorsRed.red200,
            textColor: ColorsRed.red200,
            title: "Car Engine",
            icon: 'engine',
            id: 1,
            colorLight: ColorBlue,
            colorDark: ColorDarkerBlue,
            status: [20, "Purchased"],
            levelUp: 5,
            subject: "Speed"
        }, 
        {
            iconColor: ColorsRed.red300,
            textColor: ColorsRed.red300,
            title: "Turbo",
            icon: 'car-turbocharger',
            id: 2,
            colorLight: ColorBlue, 
            colorDark: ColorDarkerBlue,
            status: [60, "Purchased"],
            levelUp: 10,
            subject: "Speed"
        }, 
        {
            iconColor: ColorsRed.red400,
            textColor: ColorsRed.red400,
            title: "Charge",
            icon: 'car-electric',
            id: 3,
            colorLight: ColorBlue, 
            colorDark: ColorDarkerBlue, 
            status: [120, "Purchased"],
            levelUp: 15,
            subject: "Speed"
        },
        {
            iconColor: ColorsRed.red500,
            textColor: ColorsRed.red500,
            title: "Capacity",
            icon: 'battery-arrow-up',
            id: 4,
            colorLight: ColorBlue, 
            colorDark: ColorDarkerBlue, 
            status: [190, "Purchased"],
            levelUp: 20,
            subject: "Speed"
        },
        {
            iconColor: ColorsRed.red600,
            textColor: ColorsRed.red600,
            title: "AI Engine",
            icon: 'integrated-circuit-chip',
            id: 5,
            colorLight: ColorBlue,
            colorDark: ColorDarkerBlue,
            status: [300, "Purchased"],
            levelUp: 25,
            subject: "Speed"
        },
]

export const accelData = 
[
        {
            iconColor: ColorsPurple.purple200,
            textColor: ColorsPurple.purple200,
            title: "+100 Pk",
            icon: 'horse-variant-fast',
            id: 1,
            colorLight: ColorPurple, 
            colorDark: ColorDarkerPurple,
            status: [65, "Purchased"],
            levelUp: 2,
            subject: "Acc"
        }, 
        {
            iconColor: ColorsPurple.purple300,
            textColor: ColorsPurple.purple300,
            title: "+2 Gear",
            icon: 'cogs',
            id: 2,
            colorLight: ColorPurple, 
            colorDark: ColorDarkerPurple,
            status: [100, "Purchased"],
            levelUp: 5,
            subject: "Acc"
        },
        {
            iconColor: ColorsPurple.purple400,
            textColor: ColorsPurple.purple400,
            title: "-100 kg",
            icon: 'weight-kilogram',
            id: 3,
            colorLight: ColorPurple, 
            colorDark: ColorDarkerPurple,
            status: [150, "Purchased"],
            levelUp: 9,
            subject: "Acc"
        }, 
        {
            iconColor: ColorsPurple.purple500,
            textColor: ColorsPurple.purple500,
            title: "Power",
            icon: 'power',
            id: 4,
            colorLight: ColorPurple, 
            colorDark: ColorDarkerPurple,
            status: [190, "Purchased"],
            levelUp: 14,
            subject: "Acc"
        },
        {
            iconColor: ColorsPurple.purple600,
            textColor: ColorsPurple.purple600,
            title: "+3 Fdrag",
            icon: 'tailwind',
            id: 5,
            colorLight: ColorPurple, 
            colorDark: ColorDarkerPurple,
            status: [250, "Purchased"],
            levelUp: 18,
            subject: "Acc"
        },

]

export const wheelsData = 
[
        {
            iconColor: ColorsOrange.orange200,
            textColor: ColorsOrange.orange200,
            title: "Tires",
            icon: 'tire',
            id: 1,
            colorLight: ColorOrange, 
            colorDark: ColorDarkerOrange,
            status: [30, "Purchased"],
            levelUp: 1,
            subject: "Wheels"
        }, 
        {
            iconColor: ColorsOrange.orange300,
            textColor: ColorsOrange.orange300,
            title: "Alignment",
            icon: 'format-horizontal-align-center',
            id: 2,
            colorLight: ColorOrange,
            colorDark: ColorDarkerOrange, 
            status: [60, "Purchased"],
            levelUp: 1,
            subject: "Wheels"
        }, 
        {
            iconColor: ColorsOrange.orange400,
            textColor: ColorsOrange.orange400,
            title: "Highway",
            icon: 'road-variant',
            id: 3,
            colorLight: ColorOrange, 
            colorDark: ColorDarkerOrange,
            status: [110, "Purchased"],
            levelUp: 1,
            subject: "Wheels"
        },
        {
            iconColor: ColorsOrange.orange500,
            textColor: ColorsOrange.orange500,
            title: "Fabric",
            icon: 'flask-plus-outline',
            id: 4,
            colorLight: ColorOrange, 
            colorDark: ColorDarkerOrange,
            status: [160, "Purchased"],
            levelUp: 1,
            subject: "Wheels"
        },
        {
            iconColor: ColorsOrange.orange600,
            textColor: ColorsOrange.orange600,
            title: "Anti Nail",
            icon: 'nail',
            id: 5,
            colorLight: ColorOrange, 
            colorDark: ColorDarkerOrange,
            status: [200, "Purchased"],
            levelUp: 1,
            subject: "Wheels"
        },
]

export const handlingData = 
[
    {
        iconColor: ColorsOrange.orange200,
        textColor: ColorsOrange.orange200,
        title: "Tires",
        icon: 'tire',
        id: 1,
        colorLight: ColorOrange, 
        colorDark: ColorDarkerOrange,
        status: [30, "Purchased"],
        levelUp: 1,
        subject: "Afstand"
    }, 
    {
        iconColor: ColorsOrange.orange300,
        textColor: ColorsOrange.orange300,
        title: "Alignment",
        icon: 'format-horizontal-align-center',
        id: 2,
        colorLight: ColorOrange,
        colorDark: ColorDarkerOrange, 
        status: [60, "Purchased"],
        levelUp: 1,
        subject: "Afstand"
    }, 
    {
        iconColor: ColorsOrange.orange400,
        textColor: ColorsOrange.orange400,
        title: "Highway",
        icon: 'road-variant',
        id: 3,
        colorLight: ColorOrange, 
        colorDark: ColorDarkerOrange,
        status: [110, "Purchased"],
        levelUp: 1,
        subject: "Afstand"
    },
    {
        iconColor: ColorsOrange.orange500,
        textColor: ColorsOrange.orange500,
        title: "Fabric",
        icon: 'flask-plus-outline',
        id: 4,
        colorLight: ColorOrange, 
        colorDark: ColorDarkerOrange,
        status: [160, "Purchased"],
        levelUp: 1,
        subject: "Afstand"
    },
    {
        iconColor: ColorsOrange.orange600,
        textColor: ColorsOrange.orange600,
        title: "Anti Nail",
        icon: 'nail',
        id: 5,
        colorLight: ColorOrange, 
        colorDark: ColorDarkerOrange,
        status: [200, "Purchased"],
        levelUp: 1,
        subject: "Afstand"
    },
]

export const parts = [    
    {
        part: "LIDAR",
        color: ColorGreen
    }, 
    {
        part: "SONAR",
        color: ColorGreen
    }, 
    {
        part: "TOUCH PAD",
        color: ColorGreen
    }
];
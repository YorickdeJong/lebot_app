import { ColorsGreen,  ColorsTile, 
     ColorsOrange, ColorsRed, ColorsPurple, 
    ColorsDarkerBlue, ColorsLightBlue, ColorsDarkerOrange, ColorsDarkerRed, 
    ColorsDarkerPurple } from "../constants/palet";


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
            iconColor: ColorsTile.blue400,
            textColor: ColorsTile.blue400,
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
            iconColor: ColorsTile.blue400,
            textColor: ColorsTile.blue400,
            title: "Turbo",
            icon: 'car-turbocharger',
            id: 2,
            colorLight: ColorBlue, 
            colorDark: ColorDarkerBlue,
            status: [60, "Purchased"],
            levelUp: 8,
            subject: "Speed"
        }, 
        {
            iconColor: ColorsTile.blue400,
            textColor: ColorsTile.blue400,
            title: "Charge",
            icon: 'car-electric',
            id: 3,
            colorLight: ColorBlue, 
            colorDark: ColorDarkerBlue, 
            status: [120, "Purchased"],
            levelUp: 12,
            subject: "Speed"
        },
        {
            iconColor: ColorsTile.blue400,
            textColor: ColorsTile.blue400,
            title: "Capacity",
            icon: 'battery-arrow-up',
            id: 4,
            colorLight: ColorBlue, 
            colorDark: ColorDarkerBlue, 
            status: [190, "Purchased"],
            levelUp: 16,
            subject: "Speed"
        },
        {
            iconColor: ColorsTile.blue400,
            textColor: ColorsTile.blue400,
            title: "AI Engine",
            icon: 'integrated-circuit-chip',
            id: 5,
            colorLight: ColorBlue,
            colorDark: ColorDarkerBlue,
            status: [300, "Purchased"],
            levelUp: 19,
            subject: "Speed"
        },
]

export const accelData = 
[
        {
            iconColor: ColorsPurple.purple300,
            textColor: ColorsPurple.purple300,
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
            iconColor: ColorsPurple.purple300,
            textColor: ColorsPurple.purple300,
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
            iconColor: ColorsPurple.purple300,
            textColor: ColorsPurple.purple300,
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
            iconColor: ColorsPurple.purple300,
            textColor: ColorsPurple.purple300,
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
            iconColor: ColorsOrange.orange400,
            textColor: ColorsOrange.orange400,
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
            iconColor: ColorsOrange.orange400,
            textColor: ColorsOrange.orange400,
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
            iconColor: ColorsOrange.orange400,
            textColor: ColorsOrange.orange400,
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
            iconColor: ColorsOrange.orange400,
            textColor: ColorsOrange.orange400,
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
            iconColor: "#F59F99",
            textColor: "#F59F99",
            title: "+2 Steering",
            icon: 'ship-wheel',
            id: 1,
            colorLight: ColorRed, 
            colorDark: ColorDarkerRed,
            status: [10, "Purchased"],
            levelUp: 1,
            subject: "Handling"
        }, 
        {
            iconColor: "#F59F99",
            textColor: "#F59F99",
            title: "Car Wheel",
            icon: 'steering',
            id: 2,
            colorLight: ColorRed, 
            colorDark: ColorDarkerRed,
            status: [40, "Purchased"],
            levelUp: 1,
            subject: "Handling"
        }, 
        {
            iconColor: "#F59F99",
            textColor: "#F59F99",
            title: "Cruise Ctrl",
            icon: 'car-cruise-control',
            id: 3,
            colorLight: ColorRed, 
            colorDark: ColorDarkerRed,
            status: [70, "Purchased"],
            levelUp: 1,
            subject: "Handling"
        },
        {
            iconColor: "#F59F99",
            textColor: "#F59F99",
            title: "Seat",
            icon: 'car-seat',
            id: 4,
            colorLight: ColorRed, 
            colorDark: ColorDarkerRed,
            status: [110, "Purchased"],
            levelUp: 1,
            subject: "Handling"
        },
        {
            iconColor: "#F59F99",
            textColor: "#F59F99",
            title: "Strut Bar",
            icon: 'car-wrench',
            id: 5,
            colorLight: ColorRed, 
            colorDark: ColorDarkerRed,
            status: [150, "Purchased"],
            levelUp: 1,
            subject: "Handling"
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
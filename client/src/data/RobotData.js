
import { ColorsGreen, ColorsBlue, ColorsTile } from "../constants/palet";

const iconColors = [ColorsGreen.green1000,  ColorsTile.mathematics]
const textColors = [ColorsGreen.green100,  ColorsTile.mathematics]

export const robotData = 
    [
        {
            iconColor: iconColors,
            textColor: textColors,
            type: "Connect",
            icon: 'key',
            id: 1,
        }, 
        {
            iconColor: iconColors,
            textColor: textColors,
            type: "Controll Robot",
            icon: 'game-controller',
            id: 2,
        }, 
        {
            iconColor: iconColors,
            textColor: textColors,
            type: "Lidar",
            icon: 'scan-circle-sharp',
            id: 3,
        },
        {
            iconColor: iconColors,
            textColor: textColors,
            type: "Sonar",
            icon: 'wifi-outline',
            id: 4,
        },
        {
            iconColor: iconColors,
            textColor: textColors,
            type: "Autonomous Driving",
            icon: 'md-car',
            id: 5,
        },
        {
            iconColor: iconColors,
            textColor: textColors,
            type: "Robot Store",
            icon: 'store',
            id: 6,
            differentDir: true
        },
        {
            iconColor: iconColors,
            textColor: textColors,
            type: "Create \n Assignment",
            icon: 'playlist-plus',
            id: 7,
            differentDir: true
        },
        {
            iconColor: iconColors,
            textColor: textColors,
            type: "Leaderboard",
            icon: 'stats-chart-outline',
            id: 8,
        },
    ]


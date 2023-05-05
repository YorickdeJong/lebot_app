
import { Alert } from 'react-native';

export function checkDataCorrectnessHandlerMotorQ2(chartData) {
    const { distance, time, speed } = chartData;
    const threshold = 0.1; // You can adjust this value based on the allowed error
    let isConstant = true;
  
    for (let motorIndex = 0; motorIndex < speed.length; motorIndex++) {
        for (let i = 1; i < time.length - 1; i++) {
            const speedDifference = Math.abs(speed[motorIndex][i] - speed[motorIndex][i - 1]);
            if (speedDifference > threshold) {
                isConstant = false;
                break;
            }
        }
        if (!isConstant) {
            break;
        }
    }
  
    console.log('isConstant', isConstant)
    return isConstant;
}


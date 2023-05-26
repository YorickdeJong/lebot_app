
import { Alert } from 'react-native';

export function checkDataCorrectnessHandlerMotorQ2(velocity) {
    // // Calculate the mean speed
    // let sum = 0;
    // let count = 0;

    // velocity.forEach(motorSpeeds => {
    //     const adjustedMotorSpeeds = motorSpeeds.slice(3, -3);
    //     sum += adjustedMotorSpeeds.reduce((a, b) => a + b, 0);
    //     count += adjustedMotorSpeeds.length;
    // });

    // const meanSpeed = sum / count;

    // const threshold = Math.abs(meanSpeed) * 0.25; // You can adjust this value based on the allowed error
    // let isConstant = true;
    // console.log('threshold', threshold)
    // for (let motorIndex = 0; motorIndex < velocity.length; motorIndex++) {
    //     let mismatchCount = 0;
    //     for (let i = 4; i < velocity.length - 4; i++) {
    //         const speedDifference = Math.abs(velocity[motorIndex][i] - velocity[motorIndex][i - 1]);
    //         if (speedDifference > threshold) {
    //             mismatchCount++;
    //         }
    //     }
    //     console.log('miscount', mismatchCount)
    //     console.log('point', Math.floor(velocity.length * 0.2))
    //     if (mismatchCount > Math.floor(velocity.length * 0.2)) {
    //         isConstant = false;
    //         break;
    //     }
    // }
  
    // return isConstant;
    return true;
}

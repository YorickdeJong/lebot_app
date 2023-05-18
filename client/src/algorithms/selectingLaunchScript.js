




export function selectingLaunchScript({subject, motorGear, scriptType, vel_max, vel_ramp, user_id, assignment_number, assignment_title, subject_title}) {
    /* 
     * subject = "CAR" || "MOTOR" || "LED"
     * motorGear = 40 || 60 || 80 || 100
     * scriptType = constant_acceleration || constant_velocity || free_measurement
     */

    // free measurement with max velocity
    if (subject === "MOTOR" && scriptType === "free_measurement"){
        command = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp encoder_movement.launch vel_max:=${carCtx.carProperties.speed} vel_ramp:=${carCtx.carProperties.acceleration} user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:="${assignmentCtx.assignmentImage.title}" subject_title:=${assignmentCtx.assignmentImage.subject}`;
    }
    // preselected velocity
    else if (subject === "MOTOR" && scriptType === "constant_velocity"){
        command = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp constant_velocity_node.launch user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:="${assignmentCtx.assignmentImage.title}" subject_title:=${assignmentCtx.assignmentImage.subject}`;
    }
    // preselected velocity with costant acceleration
    else if (subject === "MOTOR" && scriptType === "constant_acceleration"){
        command = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp constant_acceleration_node.launch user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:="${assignmentCtx.assignmentImage.title}" subject_title:=${assignmentCtx.assignmentImage.subject}`;
    }
    else if (subject === "CAR"){
        command = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp power_movement.launch vel_max:=${carCtx.carProperties.speed} vel_ramp:=${carCtx.carProperties.acceleration} user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:="${assignmentCtx.assignmentImage.title}" subject_title:=${assignmentCtx.assignmentImage.subject}`;
    }
    // free measurement with different speeds
    else if (subject === "CAR" && motorStand){
        command = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp power_movement.launch vel_max:=${motorStand} vel_ramp:=${carCtx.carProperties.acceleration} user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:="${assignmentCtx.assignmentImage.title}" subject_title:=${assignmentCtx.assignmentImage.subject}`;
    }
    else {
        command = null
    }
    return command;
}
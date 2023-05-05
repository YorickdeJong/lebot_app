import {View , Text} from 'react-native'

// Displays contents of particular group
// User Joins this group and gets assigned a group id
// with this group id, the user can access the group's content
// This content includes, measured data, answers to questions, progress, 
// robot information: which robot to connect to //predetermined, connects to that wireless access point
// when a user joins a group, a new group in the database gets created with a unique group id / group name (set by the user) / user_ids of users in that group / 
// The group id is then assigned to the user in the user_profile table in the database
function IndividualGroup(){
    return (
        <View>
            <Text>hello</Text>
        </View>
    )
}

export default IndividualGroup
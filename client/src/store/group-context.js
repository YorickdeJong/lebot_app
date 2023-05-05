export const GroupContext = createContext({
    groupInfo,
    setGroupInfoHandler: (groupInfo) => {},
    addUserToGroup: (userId, groupId) => {},
    removeUserFromGroup: (userId, groupId) => {},
    getGroupsByClassroomId: (classroomId) => {},
})

function GroupContextProvider({ children }) {
    const [groupInfo, setGroupInfo] = useState([]);

    function setGroupInfoHandler(updatedGroupInfo) {
        setGroupInfo(updatedGroupInfo);
    }

    function addUserToGroup(userId, groupId) {
        // Update groupInfo to add user to the group
    }

    function removeUserFromGroup(userId, groupId) {
        // Update groupInfo to remove user from the group
    }

    function getGroupsByClassroomId(classroomId) {
        // Filter groups based on classroomId and return them
        return groupInfo.filter(group => group.classroomId === classroomId);
    }

    const value = {
        groupInfo,
        setGroupInfoHandler,
        addUserToGroup,
        removeUserFromGroup,
        getGroupsByClassroomId,
    }

    return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
}

export default GroupContextProvider
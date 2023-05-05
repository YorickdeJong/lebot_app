const { Router } = require('express');
const {
    getUsersInGroup,
    createGroupUser,
    updateGroupUser,
    deleteGroupUser,
    deleteGroupInfo,
    deleteAllGroupsInfo
} = require('./groupsInfo.controller');
const router = Router();

router.get('/:id', getUsersInGroup);
router.post('/', createGroupUser);
router.put('/:id', updateGroupUser);
router.delete('/:id', deleteGroupUser);
router.delete('/group/:id', deleteGroupInfo);
router.delete('/all/:id', deleteAllGroupsInfo);

module.exports = router;
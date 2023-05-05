const {Router} = require('express');
const {
    createAdminAccount,
    getAllUserProfiles,
    getAllAdminProfiles,
    getUserProfileById,
    getAdminProfileById,
    createUserProfile,
    deleteUser,
    updateUser,
    updateGroupIDForClass,
    updateGroupIDForUsers,
    getUsersInGroup,
} = require('./user_profile.controller')
const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
router.delete('/:id', deleteUser)
router.put('/group/:id', updateGroupIDForUsers)
router.put('/class/:id', updateGroupIDForClass)
router.put('/:id', updateUser)

router.post('/admin', createAdminAccount)
router.get('/admin', getAllAdminProfiles)

router.get('/admin/:id', getAdminProfileById)
router.get('/users-in-group', getUsersInGroup)
router.get('/:id', getUserProfileById)
router.get('/', getAllUserProfiles)
router.post('/', createUserProfile)

module.exports = router;
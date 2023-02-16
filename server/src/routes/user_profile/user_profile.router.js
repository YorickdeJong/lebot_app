const {Router} = require('express');
const {
    getAllUserProfiles,
    getUserProfileById,
    createUserProfile,
    deleteUser,
    updateUser,
} = require('./user_profile.controller')
const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)
router.get('/:id', getUserProfileById)

router.get('/', getAllUserProfiles)
router.post('/', createUserProfile)

module.exports = router;
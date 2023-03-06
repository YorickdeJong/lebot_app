const {Router} = require('express');

const {
    getAllUserImage,
    getUserImage,
    createUserImage,
    deleteUserImage
} = require('./images.controller')

const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
// router.delete('/:id', deleteLogin)
router.get('/all', getAllUserImage);
router.get('/', getUserImage);
router.put('/', createUserImage);
router.delete('/:id', deleteUserImage);

module.exports = router;
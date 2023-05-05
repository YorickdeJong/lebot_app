
const { Router } = require('express');
const {
    getUsersInClass,
    createClassUser,
    updateClassUser,
    deleteClassUser,
    deleteClassInfo
} = require('./classesInfo.controller');
const router = Router();

router.get('/:id', getUsersInClass);
router.post('/', createClassUser);
router.put('/:id', updateClassUser);
router.delete('/:id', deleteClassUser);
router.delete('/class/:id', deleteClassInfo);

module.exports = router;

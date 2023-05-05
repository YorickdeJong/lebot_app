const {Router} = require('express');
const {
    authenticateUser,
    authenticate,
    authenticateAdmin
} = require('./authenticate_user.controller')

const router = Router()

router.post('/signin/admin', authenticateAdmin)
router.post('/signin', authenticateUser)
router.get('/protected', authenticate)

module.exports = router;
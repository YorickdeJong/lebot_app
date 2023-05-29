const { Router } = require('express');
const {
    getBrainstormText,
    createUpdateBrainstormText,
    updateBrainstormText,
    deleteBrainstormText
} = require('./think_screen.controller');
const router = Router();


router.get('/', getBrainstormText);
router.post('/', createUpdateBrainstormText);
router.put('/', updateBrainstormText);
router.delete('/:user_id/:assignment_number/:subject', deleteBrainstormText);

module.exports = router;

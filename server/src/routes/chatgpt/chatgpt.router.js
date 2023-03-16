//TODO make post and delete request to endpoint


const {Router} = require('express');

const {
    postChatgpt,
    deleteChatgpt,
    getChatHistory,
    postDescriptionOfChat,
} = require('./chatgpt.controller')


const router = Router();

router.get('/:user_id', getChatHistory);
router.post('/', postChatgpt);
router.post('/description', postDescriptionOfChat);
router.delete('/:user_id/:thread_id', deleteChatgpt);

module.exports = router;
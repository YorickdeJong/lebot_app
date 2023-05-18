



function listenToClientLiveChat(io) {
    const liveChatNamespace = io.of('api/v1/liveChat');

    liveChatNamespace.on('connection', (socket) => {
        console.log('Live Chat Client connected')
        // When a client connects, they send a 'join' event with their group ID
        socket.on('join', (groupId) => {
          socket.join(groupId);
        });
      
        // When a client sends new text, broadcast it to all other clients in the same group
        socket.on('text', (groupId, newText) => {
          socket.to(groupId).emit('text', newText);
          // Here you would also save the new text in your database
        });
      });
}

module.exports = {
    listenToClientLiveChat
}
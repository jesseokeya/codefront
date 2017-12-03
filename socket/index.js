const _sockets = (socket, io) => {
  socket.emit('success', {message: 'Successfully Connected To Socket!!'});
  socket.emit('comment', {message: 'user commented'});
}

module.exports = {
  _sockets: _sockets
}

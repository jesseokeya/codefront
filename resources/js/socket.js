const socket = io();
let currentPostId = [];

$(document).ready(() => {
  handleSockets();
});

let handleSockets = () => {
  const check = windowLocation.includes('post');
  const containsAdmin = windowLocation.includes('admin');
  if (check && (containsAdmin === false)) {
    const postNumber = windowLocation.charAt(windowLocation.length - 1);
    $.get(`/api/get/post/${postNumber}`, (result) => {
      currentPostId.push(result.data._id);
      for(let i in result.data.comments){
        const username = result.data.comments[i].username;
        const body = result.data.comments[i].body;
        $('#allComments').append(comment(username, body));
      }
    });
    socket.on('success', (data) => {
      console.log(data.message);
    });
  }
}

const postComment = () => {
  const body = $('#commentBox').val();
  const username = $('#commentUsername').val();
  const check = (body !== '' && username !== '');
  if (check) {
    const data = {
      username: username,
      body: body,
      date: new Date(),
      id: currentPostId[0]
    };

    $.post('/api/comment', data, (result) => {
      if (result.status === 200) {
        $('#allComments').append(comment(username, body));
        $('#commentBox').val('');
        $('#commentUsername').val('');
      }
    });
  }
}

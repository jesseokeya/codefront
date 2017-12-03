/* A Bunch Of Get ANd Post Requests To Modify / Change Blog */
/* Contents in realtime using websockets */
const trackPostId = [];
$(document).ready(() => {
  const check = windowLocation.includes('/admin/edit/posts');
  const lastChar = windowLocation.charAt(windowLocation.length - 1);
  if (check) {
    $.get('/api/getAllPosts', (result) => {
      for (let i = result.data.length - 1; i >= 0; i--) {
        $('#allPosts').append(postCard(result.data[i], i));
      }
    });
  };

  (windowLocation.includes('/about'))
    ? populateAboutMe()
    : '';

  editCurrentPost(lastChar);
});

const saveChangesAbout = () => {
  const postData = {
    data: returnNewAbout()
  };
  $.post('/api/update/about', postData).done((data) => {
    $('#adminMessage').append(showWarningMessage('Success!!', 'About Me Page Has Been Updated'));
    $(`#about`).val('');
    setTimeout(() => {
      $('#successMessage').remove();
    }, 3000);
  });
}

const returnNewAbout = () => {
  return $('#about').val();
}

const showWarningMessage = (heading, body) => {
  return (`<div id="successMessage" class="container">
    <div class="alert alert-success" role="alert">
      <strong>${heading}</strong> ${body}
    </div>
  </div>`);
};

const postCard = (data, index) => {
  return (`<div class="col-sm-8 col-md-4 col-lg-3 ">
      <div onclick="redirectTo(${index})" class="card shadow">
        <img class="card-img-top img-fluid" src=${data.images[0].url} alt="Card image cap">
        <div class="card-block">
          <br />
          <div class="contain-card">
            <h4 class="card-title">${data.title}</h4>
            <p class="card-text">${data.subheading}</p>
          </div>
       </div>
       <br />
       <blockquote class="blockquote contain-card">Click To Edit Post</blockquote>
       <div class="card-footer text-center">
        <small class="text-muted">
          Date Created: ${formatDate(data.date)}
        </small>
      </div>
    </div>
  </div>`);
}

const formatDate = (date) => {
  return date.substring(0, 10);
}

const redirectTo = (urlIndex) => {
  window.location.href = `/admin/edit/post/${urlIndex + 1}`;
}

const populateAboutMe = () => {
  const check = (windowLocation === '/admin/edit/about');
  $.get('/api/get/about', (result) => {
    const aboutMeText = result.data[0].description;
    $('#about').val(aboutMeText);
  });
}

const editCurrentPost = (postNumber) => {
  const lastChar = postNumber;
  const check = isNumeric(lastChar);
  if (windowLocation.includes('/admin/edit/post/') && check) {
    $('#deletButton').append(deleteButton());
    $.get(`/api/get/post/${lastChar}`, (result) => {
      const data = result.data;
      $('#postEditTitle').val(data.title);
      $('#postEditAuthor').val(data.author);
      $('#postEditHeading').val(data.heading);
      $('#postEditSubHeading').val(data.subheading);
      $('#postEditContent').val(data.body);
      for (let i in data.images) {
        const id = $('#displayUploadedImages');
        id.append(displayImageCard(data.images[i], 'Click To Change Image'));
      }
      trackPostId.push(data._id);
    });
  }
}

let handleUpdate = () => {
  const lastChar = windowLocation.charAt(windowLocation.length - 1);
  const updatedPost = {
    id: trackPostId[0],
    title: $('#postEditTitle').val(),
    author: $('#postEditAuthor').val(),
    heading: $('#postEditHeading').val(),
    subheading: $('#postEditSubHeading').val(),
    body: $('#postEditContent').val()
  }
  $.post(`/api/update/post/${lastChar}`, updatedPost, (result) => {
    if (result.isUpdated) {
      $('#alertMessage').append(showWarningMessage('Sucess!', 'Post Was Updated'));
      setTimeout(() => {
        const data = result.newPost;
        $('#alertMessage').empty();
        $('#postEditTitle').val(data.title);
        $('#titleMain').html(data.title);
        $('#postEditAuthor').val(data.author);
        $('#postEditHeading').val(data.heading);
        $('#postEditSubHeading').val(data.subheading);
        $('#postEditContent').val(data.body);
      }, 2000);
    }
  });
}

const deletePost = () => {
  const lastChar = windowLocation.charAt(windowLocation.length - 1);
  const postId = {
    id: trackPostId[0]
  }
  $.post(`/api/delete/post/${lastChar}`, postId, (result) => {
    if (result.isDeleted) {
      window.location.href = '/';
    }
  });
}

const isNumeric = (num) => {
  return !isNaN(num);
};

const comment = (username, body) => {
  let newUsername = '';
  if (username.includes(' ')) {
    const splitUsername = username.split(' ');
    newUsername = splitUsername[0].charAt(0) + splitUsername[1].charAt(0);
  } else {
    newUsername = username.charAt(0) + username.charAt(1);
  }

  const colors = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#16a085",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#2c3e50",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#ecf0f1",
    "#95a5a6",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#bdc3c7",
    "#7f8c8d"
  ]
  const random_color = colors[Math.floor(Math.random() * colors.length)];
  return (`<div style="background-color: ${random_color}" class="avatar-circle align-comment">
            <span class="initials">${newUsername}</span>
          </div>
          <p class="lead text-muted align-comment space-left">${body}</p>
          <hr/>`);
}

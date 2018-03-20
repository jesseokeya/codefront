/* Handle Image Uploads To Server Through Firebase */
let imagesUploaded = [];
let changeImageName = null;
let storage = null;

$(document).ready(() => {
  const check = (windowLocation.includes('post'));
  const correctUrl = (windowLocation === '/admin/create-post');
  const secondCheck = (windowLocation.includes('/admin/edit/post/'));
  if ((check && correctUrl) || secondCheck) {
    $.get('/api/getFirebaseConfig', (data, err) => {
      return data;
    }).then((config) => {
      firebase.initializeApp(config);
      stoage = firebase.storage();
      handleUpload();
    });
  }
});

const handleUpload = () => {
  if (firebase) {
    storage = firebase.storage();
    storage.ref().constructor.prototype.putFiles = function(files) {
      const ref = this;
      return Promise.all($.map(files, function(file) {
        const filename = file.name.replace(/ /g, '');
        return ref.child(`blogImages/${filename}`).put(file);
      }));
    }
    $('#imageUpload').on('change', (e) => {
      const storageRef = firebase.storage().ref();
      storageRef.putFiles(e.target.files).then((metadatas) => {
        // Get an array of file metadata
        getImageUrls(metadatas);
      }).catch((error) => {
        // If any task fails, handle this
        if (error) {
          throw error;
        }
      });

    });
  }
}

const validateSubmit = () => {
  const validate = (imagesUploaded.length > 0 && $('#postTitle').val() !== '' && $('#postAuthor').val() !== '' && $('#postHeading').val() !== '' && $('#postSubHeading').val() !== '' && $('#postContent').val() !== '');
  return validate;
}

const handleSubmit = () => {
  if (validateSubmit()) {

    const blogData = {
      title: $('#postTitle').val(),
      author: $('#postAuthor').val(),
      heading: $('#postHeading').val(),
      subheading: $('#postSubHeading').val(),
      body: $('#postContent').val(),
      hidden: false,
      images: imagesUploaded
    }

    $.post('/api/create', blogData).done((data) => {
      const message = showWarningMessage('Success!', 'New Blogpost Was Created');
      $('#alertMessage').append(message);
      setTimeout(() => {
        $('#successMessage').remove();
        $('#postTitle').val('');
        $('#postAuthor').val('');
        $('#postHeading').val('');
        $('#postSubHeading').val('');
        $('#postContent').val('');
        $('#uploadProgress').css('width', '0%');
        $("#fileHelp").val('');
      }, 1000);
      imagesUploaded = [];
    });
  } else {
    const message = dangerMessage('Try Again!', 'Incomplete Form Fields');
    $('#alertMessage').append(message);
  }
}

const getImageUrls = (metadatas) => {
  for (let i in metadatas) {
    const imageInfo = {
      alt: metadatas[i].metadata.name,
      url: metadatas[i].metadata.downloadURLs[0]
    }
    imagesUploaded.push(imageInfo);
    const displayUploaded = $('#displayUploadedImages');
    displayUploaded.append(displayImageCard(imageInfo, ''));
    (i == (metadatas.length - 1))
      ? $('#uploadProgress').css('width', '100%')
      : '';
  }
}

const displayImageCard = (image, text) => {
  return (`<div class="col-sm-8 col-md-4 col-lg-3 ">
            <div onclick="changeImage('${image.alt}')" class="card">
              <img class="card-img img-fluid" src=${image.url} alt="uploaded images">
              <div class="card-img-overlay">
              <h5 class="card-title text-white">${text}</h5>
              </div>
            </div>
          </div>`);
}

const changeImage = (imageName) => {
  $('#hiddenUpload').click();
  changeImageName = imageName;
}

function updateImage(e) {

  if (changeImageName !== null) {
    const allInputs = document.getElementsByTagName('input');
    const file = allInputs[allInputs.length - 1].files[0];
    let storageRef = storage.ref(`blogImages/${changeImageName}`);
    let task = storageRef.put(file);
    task.on('state_changed', snapshot => {
      const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      const progress_bar = percentage;
      if (progress_bar >= 100) {
        $('#imageUploadSucess').append(showWarningMessage('Success!!', 'Image Has Been Successfully Updated'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }, err => {
      if (err) {
        throw err;
      }
    }, data => {
      return data;
    })
  }
  changeImageName = null;
}

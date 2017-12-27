$(document).ready(() => {
  if (windowLocation.includes('admin')) {
    ga('send', 'pageview', window.location.pathname);
  } else {
    if (window.location.pathname === '/contact') {
      ga('send', 'pageview', '/contact');
      $('#sendMessageButton').click(() => {
        ga('send', 'pageview', '/contactMeFormSubmitted');
      })
    }
    if (window.location.pathname === '/about') {
      ga('send', 'pageview', '/about');
    }
    if (window.location.pathname === '/') {
      ga('send', 'pageview', '/homepage');
    }
    if (window.location.pathname.includes('/post/') && window.location.pathname.length <= 8) {
      ga('send', 'pageview', window.location.pathname);
      $('submitComment').click(() => {
        ga('send', 'pageview', window.location.pathname + '/comments');
      });
    }
  }
});

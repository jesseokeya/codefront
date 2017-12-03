const config = {
  home: [
    '/', '/blog', '/home'
  ],
  routes: [
    '/admin/edit/post/', '/admin/edit/', '/post', '/admin'
  ],
  port: process.env.PORT || 3000,
  _db: 'mongodb://codefront:codefront@ds129776.mlab.com:29776/codefront',
  credentials: {
    email: 'jesseokeya@gmail.com',
    password: 'codefront2017'
  },
  private: true,
  enableAutoRefresh: false,
  firebase: {
    apiKey: "AIzaSyAsHUjyfOzAKLUxVJK19fdKw9r_Df-y8cE",
    authDomain: "melissas-blog.firebaseapp.com",
    databaseURL: "https://melissas-blog.firebaseio.com",
    projectId: "melissas-blog",
    storageBucket: "melissas-blog.appspot.com",
    messagingSenderId: "440662663872"
  }
}

module.exports = config;

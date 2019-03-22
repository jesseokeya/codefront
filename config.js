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
  enableAutoRefresh: true
}

module.exports = config;

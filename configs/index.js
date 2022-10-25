module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  auth: {
    google: {
      CLIENT_ID:
        "707521570006-l2009p8jv7d8ajrnjro009lkpecqh0a2.apps.googleusercontent.com",
      CLIENT_SECRET: "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",
    },
    facebook: {
      CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
      CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    },
  },
};
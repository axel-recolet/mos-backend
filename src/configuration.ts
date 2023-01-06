export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongodb: {
    uri: `${process.env.MONGODB_HOST || 'mongodb://localhost'}:${
      process.env.MONGODB_PORT || 27017
    }/mos`,
  },
  jwt: {
    secret: process.env.JWT,
    signOptions: { expiresIn: '60s' },
  },
});

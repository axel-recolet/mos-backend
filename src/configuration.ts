export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  mongodb: {
    uri: `mongodb://${process.env.MONGODB_USERNAME || 'root'}:${
      process.env.MONGODB_PASSWORD || 'root'
    }@${process.env.MONGODB_HOST || 'localhost'}:${
      process.env.MONGODB_PORT || '27017'
    }/${process.env.MONGODB_DATABASE || 'mos'}?authSource=admin`,
    retryAttempts: 10,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '600s' },
  },
});

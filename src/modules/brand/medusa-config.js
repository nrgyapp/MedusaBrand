module.exports = {
  projectConfig: {
    redis_url: process.env.REDIS_URL,
    database_url: process.env.DATABASE_URL,
    database_type: "postgres",
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
  },
  plugins: [],
  modules: {
    brand: {
      resolve: "./src/modules/brand",
      options: {
        image: {
          thumbnailSize: 100,
          listSize: 200,
          gallerySize: 600,
          productSize: 400,
          defaultFormat: "webp",
          defaultQuality: 80
        }
      }
    }
  }
}
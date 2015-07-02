module.exports = {
  rethinkdb: {
      host: process.env.RETHINKDB_HOST || "localhost",
      port: 28015,
      db: "foobar"
  },
  server: {
      port: 3000
  }
}

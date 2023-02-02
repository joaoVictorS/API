module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "123",
  database: "develop",
  define: {
    timestamp: true, // cria duas colunas: createdAt e updatedAt
    underscored: true,
    underscoredAll: true,
  },
};

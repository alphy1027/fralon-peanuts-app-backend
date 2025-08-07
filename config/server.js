const PORT = process.env.PORT || 3000;

const startServer = (app) => {
  app.listen(PORT, () => {
    console.log(`Server listening to requests on port::${PORT}`);
  });
};

module.exports = startServer;

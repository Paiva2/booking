import app from './app';

const port = Number(process.env.PORT) ?? 8001;

const server = app.listen(port, () => {
  console.log(`⚡️ Server running on: ${port}`);
});

export default server;

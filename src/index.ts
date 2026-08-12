import app from './app';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Enterprise IAM Auth Service is running on http://localhost:${PORT}`);
});

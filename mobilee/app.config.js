import 'dotenv/config';                // loads .env into process.env

export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: process.env.API_URL,      // grabs API_URL from your .env
  },
});

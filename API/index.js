require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const fileuploadRoutes = require("./routes/fileuploadRoutes");

const contentRoutes = require('./routes/contentRoutes');
const usersRoutes = require('./routes/usersRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const siteconfigRoutes = require('./routes/siteconfigRoutes');
const blogsRoutes = require('./routes/blogsRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const leadsRoutes = require('./routes/leadsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;  

// trust proxy (for correct req.ip behind proxies/CDNs)
app.set('trust proxy', true);

// CORS options
const corsOptions = {
  origin: '*', // If you want any URL then use '*'
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Use CORS middleware with options
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));

app.use("/api/file", fileuploadRoutes);

app.use('/api/content', contentRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/siteconfig', siteconfigRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/leads', leadsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
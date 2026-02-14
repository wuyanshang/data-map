process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const config = require('../config/webpack.config');
const paths = require('../config/paths');
const fs = require('fs-extra');

// Remove build folder
fs.emptyDirSync(paths.appBuild);

console.log('Creating an optimized production build...');

webpack(config, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    process.exit(1);
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
    process.exit(1);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  console.log('Compiled successfully!');
  console.log('Build folder is ready to be deployed.');
});

import webpack from 'webpack';
import path from 'path';
import clean from './clean';
import webpackConfig from './webpack.config';

const compile = () => {
  webpack(webpackConfig).run((err, stats) => {
    if (err) {
      return console.error(err);
    }

    return console.info(stats.toString(webpackConfig[0].stats));
  });
};

// Remove all old files and start the compiler

clean(path.resolve(__dirname, '../build/js/*.js'), {}, compile);

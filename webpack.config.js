const path = require('path');

module.exports = {
  mode: 'development', // Set the mode to 'development', 'production', or 'none'
  entry: './index.js', // Update this path based on your index.js location
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

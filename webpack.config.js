var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractPlugin = require('extract-text-webpack-plugin');

process.env.NODE_ENV = 'production';

var production = process.env.NODE_ENV === 'production';

var plugins = [
    // where should content be piped
    //new ExtractPlugin('bundle.css'),

    new webpack.optimize.CommonsChunkPlugin({
        // Move dependencies to our main file
        name: 'main',

        // Look for common dependencies in all children,
        children: true,

        // How many times a dependency must come up before being extracted
        minChunks: 2
    })
];

// If the env is production, concat production plugins.
if (production) {
    plugins = plugins.concat([
        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),

        // This plugins optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200, // ~50kb
        }),

        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false, // Suppress uglification warnings
            }
        }),

        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__: !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__: !production,
            'process.env': {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
            }
        }),

        // Cleanup the builds/ folder before
        // compiling our final assets
        new CleanPlugin('builds')
    ]);
}

module.exports = {
    // switches loaders to and from debug mode, which means they won’t pack-in more code to 
    // let you more easily debug things in local
    debug: !production,

    // sourcemaps generation, eval is just the best one in local. In production we may 
    // not really care about sourcemaps so we disable them
    devtool: production ? false : 'eval',

    entry: './src',

    output: {
        path: 'builds',
        filename: 'bundle.js',
        //filename: production ? '[name]-[hash].js' : 'bundle.js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: 'builds/'
    },

    // use the webpack-dev-server as your own local server. 
    // If you plan to always use it for HMR
    devServer: {
        hot: true,
    },

    plugins: plugins,

    module: {
        // add our pre-loader, we simply use the same syntax as before
        preLoaders: [{
            test: /\.js$/,
            loader: 'eslint',
        }],
        loaders: [{
            test: /\.scss$/,
            loader: 'style!css!sass'
                //loader: ExtractPlugin.extract('style', 'css!sass')
        }, {
            test: /\.js$/,
            loader: 'babel',
            // 不认识include语法
            exclude: /node_modules/,
            query: {
                presets: ['react', 'es2015']
            }
        }, {
            test: /\.html$/,
            loader: 'html'
        }, {
            /*
                passing a limit query parameter to the url-loader which tells it: 
                if the asset is smaller than 10kb inline it, else, fallback to the file-loader 
                and reference it.
            */
            test: /\.(png|gif|jpe?g|svg)$/i,
            loader: 'url',
            query: {
                limit: 10000 // 10kb
            }
        }, {

            //every component we currently import its stylesheet of the same name, 
            //and its template of the same name. Let’s use a pre-loader to automatically 
            //load any files bearing the same name as a module

            test: /\.js$/,
            loader: 'baggage?[file].html=template&[file].scss',
        }]
    }
};

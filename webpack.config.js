let _ = require("lodash");
let rimraf = require("rimraf");
let ExtractTextPlugin = require("extract-text-webpack-plugin");

function config(entry) {
    entry = entry || "App";
    let ext = new ExtractTextPlugin(`${entry}/bundle.css`);
    let base = {
        entry: `./src/${entry}`,
        output: {
            filename: `${entry}/bundle.js`,
            libraryTarget: "umd",
            /*publicPath: "/"*/
        },
        resolve: {extensions: [".ts", ".tsx", ".js", ".json"]},
        module: {
            rules: [
                {test: /\.tsx?$/, loader: "awesome-typescript-loader"},
                {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},
                {test: /\.less$/i, use: ext.extract(['css-loader', 'less-loader'])},
                // {test: /\.(png|svg|jpg|gif)$/, use: "file-loader"},
            ]
        },
        plugins: [ext]
    };

    let externals = {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-router": "ReactRouter",
        "react-router-dom": "ReactRouterDOM",
        "lodash": "_",
        "moment": "moment",
        "mobx": "mobx",
        "mobx-react": "mobxReact",
        "bluebird": "Promise",
    };

    return _.defaultsDeep({
        output: {
            path: `${__dirname}/deploy/bundle`,
        },
        devtool: "source-map",
        externals: externals,
    }, base);
}

module.exports = (env) => {
    env = env || {};
    if (env.clean) {
        rimraf.sync(`${__dirname}/dist`);
        rimraf.sync(`${__dirname}/deploy/bundle`);
    } else return [
        config("Admin"),
        config("Teacher"),
        config("User"),
    ]
};

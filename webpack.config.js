module.exports = [
    {
        entry: './customer',
        output: {
            path: 'public',
            filename: 'customer-bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.(es6|jsx?)$/,
                    exclude: /node_modules/,
                    loader: 'babel',
                    query: {
                    presets: ['react', 'es2015', 'stage-0']
                    }
                },
                {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                },
                {
                    test: /\.json$/,
                    loader: "json-loader"
                }
            ]
        },
        resolve: {
            extensions: ['', '.js', '.jsx', '.es6', '.json']
        }
    },
    {
        entry: './business-admin',
        output: {
            path: 'public',
            filename: 'ba-bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.(es6|jsx?)$/,
                    exclude: /node_modules/,
                    loader: 'babel',
                    query: {
                    presets: ['react', 'es2015', 'stage-0']
                    }
                },
                {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                },
                {
                    test: /\.json$/,
                    loader: "json-loader"
                }
            ]
        },
        resolve: {
            extensions: ['', '.js', '.jsx', '.es6', '.json']
        }
    }
]

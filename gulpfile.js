const { src, dest, series, watch } = require(`gulp`),
    CSSLinter = require(`gulp-stylelint`),
    { deleteAsync } = require(`del`),
    babel = require(`gulp-babel`),
    htmlCompressor = require(`gulp-htmlmin`),
    htmlValidator = require(`gulp-html`),
    jsCompressor = require(`gulp-uglify`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;

let browserChoice = `default`;

let validateHTML = () => {
    return src(`./*.html`)
        .pipe(htmlValidator(undefined));
};

let compressHTML = () => {
    return src(`./*.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let lintJS = () => {
    return src(`js/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

let transpileJSForDev = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/js`));
};

let transpileJSForProd = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

let lintCSS = () => {
    return src(`styles/*.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [{formatter: `string`, console: true}]
        }))
        .pipe(dest(`temp/styles`)); // Moves clean CSS to temp for the browser to use
};

exports.validateHTML = validateHTML;
exports.compressHTML = compressHTML;
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.lintCSS = lintCSS;

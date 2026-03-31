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
        .pipe(dest(`temp/styles`));
};

let copyUnprocessedAssetsForProd = () => {
    return src([
        `img/**`,
        `json/**`,
        `styles/**`
    ], { base: './' })
        .pipe(dest(`prod`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `temp`,
                `./`
            ]
        }
    });

    watch(`js/*.js`, series(lintJS, transpileJSForDev)).on(`change`, reload);

    watch(`styles/*.css`, lintCSS).on(`change`, reload);

    watch(`./*.html`, validateHTML).on(`change`, reload);

    watch(`img/**/*`).on(`change`, reload);
};

async function clean() {
    const foldersToDelete = await deleteAsync([`./temp`, `prod`]);
    console.log(`The following directories were deleted:`, foldersToDelete);
}

exports.validateHTML = validateHTML;
exports.compressHTML = compressHTML;
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.lintCSS = lintCSS;
exports.copyUnprocessedAssetsForProd = copyUnprocessedAssetsForProd;
exports.clean = clean;
exports.serve = series(
    clean,
    validateHTML,
    lintCSS,
    lintJS,
    transpileJSForDev,
    serve
);
exports.build = series(
    clean,
    compressHTML,
    transpileJSForProd,
    copyUnprocessedAssetsForProd
);

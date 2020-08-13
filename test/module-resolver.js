/* eslint-disable import/no-nodejs-modules */
const fs = require( 'fs' );
const path = require( 'path' );

const packages = fs
	.readdirSync( path.join( __dirname, '../packages' ), { withFileTypes: true } )
	.filter( ( file ) => file.isDirectory() )
	.map( ( file ) => require( path.join( __dirname, '../packages', file.name, 'package.json' ) ) )
	.filter( ( pkg ) => pkg.module )
	.map( ( pkg ) => pkg.name );

/**
 * Implements a custom resolver that uses `pkg.module` isntead of `pkg.main` for packages from the monorepo.
 *
 * Doc: https://jestjs.io/docs/en/configuration#resolver-string
 *
 * Jest will call this method with the package to be resolved. We'll call back the default resolver but passing
 * an extra `packageFilter`. The default resolver will call `resolve` (https://www.npmjs.com/package/resolve). That
 * library will read `package.json` from the requested module and pass it through `packageFilter` to pre-process it
 * before trying to read the entrypoint.
 *
 * If the requested package _name_ is one of the packages we have under `./packages`, we tell the resolver to use `pkg.moudle`
 * to read the main file.
 *
 * Note that we can't do this for any package that exports `module` because we'll probably need to transpile it. This will require
 * to transpile node_modules, which is very slow.
 *
 * @param {string} request The package being requested
 * @param {*} options Options for the resolver
 */
module.exports = ( request, options ) => {
	return options.defaultResolver( request, {
		...options,
		packageFilter: ( pkg ) => {
			//TODO: when Jest moves to resolver v2, this method will receive a second argument that points to the real package file (ie: no symlink)
			//We can use it to determine if the package file is within the repo
			if ( packages.includes( pkg.name ) ) {
				return {
					...pkg,
					main: pkg.module,
				};
			}
			return pkg;
		},
	} );
};

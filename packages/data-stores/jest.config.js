module.exports = {
	preset: '@automattic/calypso-build',
	rootDir: __dirname,
	setupFiles: [ 'regenerator-runtime/runtime' ],
	resolver: '<rootDir>/../../test/module-resolver.js',
};

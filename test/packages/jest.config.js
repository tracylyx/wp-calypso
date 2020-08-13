module.exports = {
	rootDir: './../../',
	// run tests for all packages that have a Jest config file
	projects: [ '<rootDir>/packages/*/jest.config.js' ],
	resolver: '<rootDir>/test/module-resolver.js',
};

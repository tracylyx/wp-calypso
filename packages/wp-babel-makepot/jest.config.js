module.exports = {
	rootDir: __dirname,
	testMatch: [ '<rootDir>/**/test/*.[jt]s?(x)', '!**/.eslintrc.*', '!**/examples/**' ],
	resolver: '<rootDir>/../../test/module-resolver.js',
};

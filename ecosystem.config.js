module.exports = {
	apps: [
		{
			name: "app1",
			script: "./dist/main.js",
			instances: 1,
			max_restarts: 3,
		},
	],
};

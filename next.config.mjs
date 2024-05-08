/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ["@svgr/webpack"],
		});
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "4000",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "cdn-images-1.medium.com",
				port: "",
				pathname: "/v2/resize:fit:1024/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "4000",
				pathname: "/public/**",
			},
		],
	},
};

export default nextConfig;

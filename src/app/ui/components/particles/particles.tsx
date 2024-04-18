import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const TSParticles = () => {
	const [init, setInit] = useState(false);

	useEffect(() => {
		initParticlesEngine(async (engine) => {
			await loadSlim(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	const particlesLoaded = async (container?: Container): Promise<void> => {
		// console.log(container);
	};

	const options: ISourceOptions = useMemo(
		() => ({
			background: {
				color: {
					value: "transparent",
				},
			},
			fullScreen: {
				enable: true,
			},
			fpsLimit: 120,
			interactivity: {
				events: {
					onClick: {
						enable: true,
						mode: "repulse",
					},
					onHover: {
						enable: true,
						mode: "repulse",
					},
				},
				modes: {
					push: {
						quantity: 4,
					},
					repulse: {
						distance: 150,
						duration: 1000,
					},
				},
			},
			particles: {
				color: {
					value: "#000",
				},
				links: {
					color: "#000",
					distance: 300,
					enable: true,
					opacity: 0.1,
					width: 1,
				},
				move: {
					direction: "none",
					enable: true,
					outModes: {
						default: "out",
					},
					random: true,
					speed: 0.5,
					straight: false,
				},
				number: {
					density: {
						enable: true,
					},
					value: 100,
				},
				opacity: {
					value: 0.1,
				},
				shape: {
					type: "circle",
				},
				size: {
					value: { min: 1, max: 4 },
				},
			},
			detectRetina: true,
		}),
		[]
	);
	return <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />;
};

export default TSParticles;

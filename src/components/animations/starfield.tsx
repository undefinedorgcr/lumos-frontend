import React, { useState, useEffect } from 'react';

interface Star {
	id: number;
	left: string;
	top: string;
	animationDuration: string;
	size: string;
}

const StarField = () => {
	const [stars, setStars] = useState<Star[]>([]);

	// Función para crear una nueva estrella con posición aleatoria
	function createStar(): Star {
		return {
			id: Math.random(),
			left: `${Math.random() * 100}%`,
			top: `${Math.random() * 100}%`,
			animationDuration: `${Math.random() * 2 + 1}s`,
			size: `${Math.random() * 3 + 1}px`,
		};
	}

	// Efecto para manejar la creación y eliminación de estrellas
	useEffect(() => {
		// Crear estrellas iniciales
		const initialStars = Array.from({ length: 100 }, createStar);
		setStars(initialStars);

		// Intervalos para crear y eliminar estrellas
		const createInterval = setInterval(() => {
			setStars((prevStars) => [...prevStars, createStar()]);
		}, 500);

		const removeInterval = setInterval(() => {
			setStars((prevStars) => {
				const newStars = [...prevStars];
				if (newStars.length > 100) {
					newStars.shift();
				}
				return newStars;
			});
		}, 500);

		return () => {
			clearInterval(createInterval);
			clearInterval(removeInterval);
		};
	}, []);

	return (
		<div className="fixed inset-0 pointer-events-none">
			{stars.map((star) => (
				<div
					key={star.id}
					className="absolute rounded-full bg-white animate-twinkle"
					style={{
						left: star.left,
						top: star.top,
						width: star.size,
						height: star.size,
						opacity: 0,
						animation: `twinkle ${star.animationDuration} ease-in-out infinite`,
					}}
				/>
			))}
		</div>
	);
};

export default StarField;

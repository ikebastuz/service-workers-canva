const runCircle = () => {
	const speed = 0.05;
	const area = 150;

	const circle = document.getElementById('circle');
	const { width: boxWidth, height: boxHeight } = circle.parentElement.getBoundingClientRect();
	const { width: circleWidth, height: circleHeight } = circle.getBoundingClientRect();

	let X = 0;
	let Y = 0;

	const draw = () => {
		X += speed;
		Y += speed * 1.5;
		circle.style.left = `${Math.sin(X) * area + boxWidth / 2 - circleWidth / 2}px`;
		circle.style.top = `${Math.cos(Y) * area + boxHeight / 2 - circleHeight / 2}px`;

		window.requestAnimationFrame(draw);
	};
	draw();
};

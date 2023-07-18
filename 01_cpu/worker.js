importScripts('./lib.js');

self.addEventListener(
	'message',
	e => {
		const { data, task } = e.data;
		switch (task) {
			case 'fibonacci':
				var result = fib(data);
				self.postMessage({ task, result });
				break;
			case 'sort':
				var result = bubbleSort(data);
				self.postMessage({ task, result });
				break;
			default:
				self.postMessage('Unknown command');
		}
	},
	false
);

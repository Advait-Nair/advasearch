// let iframe = document.querySelector('iframe')

// iframe.onload = () => {
//     console.log(iframe.contentWindow);
//     let newurl = (iframe.contentWindow.location != iframe.contentWindow.parent.location) ? document.referrer : document.location.href;

//     console.log(newurl);
//     if (
// 		!newurl.includes('advasearch.netlify.app') &&
// 		!newurl.includes('chrome-extension')
// 	) {
// 		location.href = newurl;
// 	} else {
// 		// setInterval(() => {
// 		// 	if (!newurl.includes('advasearch.netlify.app'))
// 		// 		location.href = newurl;
// 		// 	console.log(newurl);
// 		// }, 100);
// 	}
// };
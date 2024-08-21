export function getTime(withSeconds: boolean, customDate?: Date) {
	// return time as HH:MM
	// e.g. 12:34
	const date = customDate || new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	let seconds = '';
	if (withSeconds) {
		seconds = `:${date.getSeconds().toString().padStart(2, '0')}`;
	}
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` + seconds;
}

export function getDate(customDate?: Date) {
	// return date as DDD DD MMM
	// e.g. 01 Jan 2020
	const dateObj = customDate || new Date();
	const date = dateObj.getDate();
	const month = dateObj.toLocaleString('default', { month: 'short' });

	let day = dateObj.toLocaleString('default', { weekday: 'short' });
	day = day.charAt(0).toUpperCase() + day.slice(1);

	return `${day} ${date} ${month}`;
}

export function getVersion(): string {
    return 'v1.0.0'
}

// RichText processing Functions

function RichText(str:string, identifier:string) {
	// span with identifier as class
	return `<span class="RT-${identifier}">${nbsp(str)}</span>`
}

export interface RichOutput {
	processedInput: string;
	autocomplete: string;
}

function autocompleteNamespace(dobj:DomainObject, str:string, trailingWhitespace: boolean) {
	if (str.trim().length == 0) return '';
	// determine whether the string is a domain namespace or a function call
	let matcher = '';

	if (str.split(' ').length == 1) {
		if (trailingWhitespace) return str;

		// domain namespace

		Object.keys(dobj.domains).forEach((domain) => {
			if (domain.startsWith(str)) {
				matcher = domain;
			}
		});

		if (str != matcher) {
			matcher = str + RichText(matcher.replace(str, ''), 'autocomplete');
		}

	}
	return matcher;
}


function nbsp(str:string) {
	return str.replaceAll(' ', '&nbsp;');
}

function autocompleteFunction(dobj:DomainObject, str:string) {
	if (str.trim().length == 0) return str;
	// determine whether the string is a domain namespace or a function call
	let matcher = '';

	if (str.split(' ').length == 2) {
		// function call
		const [domain, func] = str.split(' ');


		let noMatch = true;
		if (domain in dobj.domains) {
			const domainObj = dobj.domains[domain];
			if (typeof domainObj === 'object') {
				Object.keys(domainObj).forEach((funcName) => {
					if (funcName.startsWith(func)) {
						matcher = funcName;
						console.log(matcher)
						noMatch = false;
					}
				});
			}
		}

		
		if (str != matcher) {
			if (noMatch) {
				matcher = str
			} else
			matcher = str + RichText(matcher.replace(func, ''), 'autocomplete');
		} else {
			matcher = str;
		}
		console.log({str, matcher})
	}
	return matcher;
}

function autocompleteSubfunction(dobj: DomainObject, str: string) {
	if (str.trim().length == 0) return str;
	let matcher = '';

	if (str.split(' ').length == 3) {
		// function call
		const [domain, func, subfunc] = str.split(' ');

		// does it even have a subfunction?

		if (domain in dobj.domains) {
			const domainObj = dobj.domains[domain];
			if (typeof domainObj === 'object') {
				if (func in domainObj) {
					const funcObj = domainObj[func];
					console.log(funcObj, func, domainObj)
					if (typeof funcObj === 'object') {
						Object.keys(funcObj).forEach((subfuncName) => {
							if (subfuncName.startsWith(subfunc)) {
								matcher = subfuncName;
								console.log(matcher)
							}
						});
					}
				}
			}
		}

		if (str != matcher) {
			matcher = str + RichText(matcher.replace(subfunc, ''), 'autocomplete');
		} else {
			matcher = str;
		}
		console.log(matcher)
	}
	return matcher;
}

function partialMatch(str:string, arr:string[]) {
	let match = false;
	arr.forEach((item) => {
		if (item.startsWith(str)) {
			match = true;
		}
	});
	return match;
}


export function processInput(dobj:DomainObject, nv: string): RichOutput {
	// the string being returned can include colour through the use of span objects, autocomplete, etc. this behaviour will depend on what is being typed and the results are related to the domain object (dobj)
	let processedInput = nv;
	// split into tokens by whitespace
	const tokens = nv.split(' ');
	const DomainNamespace = tokens[0];
	// if nothing is split we cant do much except provide autocomplete
	if (tokens.length == 1) {
	processedInput = autocompleteNamespace(dobj, nv, nv.endsWith(' '));
	}
	// if applicable function autocomplete
	else if (tokens.length == 2) {
	processedInput = autocompleteFunction(dobj, nv);
	}
	// if applicable subfunction autocomplete
	else if (tokens.length == 3) {
	processedInput = autocompleteSubfunction(dobj, nv);
	}


	// give tokens their colours if valid

	let pinputArray = processedInput.split(' ');
	// domain namespace
	if (DomainNamespace in dobj.domains) {
		console.log('yeah!')
		pinputArray[0] = pinputArray[0].replace(DomainNamespace, RichText(DomainNamespace, 'namespace'));
		// function call
		const FunctionCall = tokens[1];
		const domainObj = dobj.domains[DomainNamespace];
		if (typeof domainObj === 'object') {
			if (FunctionCall in domainObj) {
				pinputArray[1] = pinputArray[1].replace(FunctionCall, RichText(FunctionCall, 'fn'));

				// if subfunction
				if (tokens.length >= 3) {
					const SubFunction = tokens[2].trim();
					const functionObj = domainObj[FunctionCall];
					if (typeof functionObj === 'object') {
						if (SubFunction in functionObj) {
							pinputArray[2] = pinputArray[2].replace(SubFunction, RichText(SubFunction, 'subq'));
						}
					}
					if (!(SubFunction in functionObj)) {
						console.log('!')
						// everything after the subfunction is a term, including it
						let remaining = '';
						for (let i = 2; i < tokens.length; i++) {
							remaining += tokens[i] + ' ';
						}

						pinputArray[2] = pinputArray[2].replace(remaining, RichText(SubFunction, 'term'));
					}
				}

			} else if (!partialMatch(FunctionCall, Object.keys(domainObj)) && FunctionCall) {
				console.log('no!');
				// functioncall in term RT
				pinputArray[1] = pinputArray[1].replace(FunctionCall, RichText(FunctionCall, 'term'));
			}
		}  else {
			pinputArray[1] = pinputArray[1]?.replace(FunctionCall, RichText(FunctionCall, 'term'));
		}
	}

	// console.log(processedInput, pinputArray)
	processedInput = pinputArray.join(' ');
	// console.log(processedInput)



	
	console.log({processedInput})

	return {
		processedInput,
		autocomplete: ''
	};
}

interface URI {
	protocol: string;
	host: string;
}
export interface MultiFunctionalDomain {
	DefaultBehaviour: string | URI;
	[FunctionCaller: string]: string | URI;
}

export interface DomainObject {
	domains: {
		[DomainNamespace: string]: MultiFunctionalDomain | string | URI;
	}
}
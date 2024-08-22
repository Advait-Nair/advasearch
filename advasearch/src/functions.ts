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
	autocomplete: string[];
	autocompleteFormatted: string[];
	generatedURI: string;
	conflict: boolean;
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
	if (str.trim().length == 0) return '';
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

function matches(str:string, arr:string[]) {
	let matches:string[] = [];
	arr.forEach((item) => {
		if (item.startsWith(str)) {
			matches.push(item);
		}
	});
	return matches;
}

export function colourCoded(arr:string[]) {
	let buffer:string[] = [];
	arr.forEach((item) => {
		let tokens = item.split(' ');
		let buffer2 = '';
		buffer2 += RichText(tokens[0], 'namespace') + ' ';
		if (tokens.length >= 2)
			buffer2 += RichText(tokens[1], 'fn') + ' ';
		if (tokens.length >= 3) {
			buffer2 += RichText(tokens[2], 'subq');
		}
		buffer.push(buffer2)
		// console.log(buffer, buffer2)
	});

	return buffer;
}

function ignoreWhitespace(tokens:string[], maxLength:number) {
	// remove whitespace entries from tokens
	let buffer:string[] = [];
	tokens.forEach((token) => {
		if (token.trim().length > 0) {
			buffer.push(token);
		}
	});

	console.log(buffer)

	return buffer.length == maxLength;
}


function isIn(str:string, matching:string):boolean {
	// loop through length of both. Any character differences returns false
	
	// if str1 is larger it will not match str matcher
	if (str.length > matching.length) return false;

	// loop through
	let characterDisparity = false;
	for (let i = 0; i > str.length; i++) {
		if (
			str[i] != matching[i]
		) characterDisparity = true
	}
	return characterDisparity

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

					console.log(tokens)
					if (typeof functionObj === 'object') {
						if (SubFunction in functionObj && ignoreWhitespace(tokens, 3)) {
							
							// if the pinput array is longer than the subfunction it becomes a term
							
							// if (pinputArray[2].length > SubFunction.length) {
							// 	let remaining = '';
							// 	for (let i = 2; i < tokens.length; i++) {
							// 		remaining += tokens[i] + ' ';
							// 		pinputArray[i] = pinputArray[i].replace(tokens[i], RichText(tokens[i], 'term'));
							// 	}
							// }
							// else
								pinputArray[2] = pinputArray[2].replace(SubFunction, RichText(SubFunction, 'subq'));
						} else {
							//every token after the subfunction is a term, including it

							// dont let this happen if there is an autocomplete suggestion
							// autocomplete triggers if the subfunction has a match

							let completeAggregation = '';
							for (let i = 2; i < tokens.length; i++) {
								completeAggregation += tokens[i] + ' ';
							}

							let doesNotMatch = false;
							Object.keys(functionObj).forEach((subfunc) => {
								console.log(completeAggregation, subfunc, 'TESTING SUBQ')
								if (isIn(completeAggregation, subfunc)) {
									doesNotMatch = true;
								}
								// console.log(doesNotMatch)
							});



							if (!doesNotMatch) {
								let remaining = '';
								for (let i = 2; i < tokens.length; i++) {
									remaining += tokens[i] + ' ';
									pinputArray[i] = pinputArray[i].replace(tokens[i], RichText(tokens[i], 'term'));
								}
							};
							
							
							// pinputArray[2] = pinputArray[2].replace(remaining, RichText(remaining, 'term'));
							
							
						}
					} else {
						let remaining = '';
						for (let i = 2; i < tokens.length; i++) {
							remaining += tokens[i] + ' ';
							pinputArray[i] = pinputArray[i].replace(tokens[i], RichText(tokens[i], 'term'));
						}
					}
					// @ts-ignore
					if (functionObj instanceof String) {
						// everything after the subfunction is a term, including it
						let remaining = '';
						for (let i = 2; i < tokens.length; i++) {
							remaining += tokens[i] + ' ';
						}

						pinputArray[2] = pinputArray[2].replace(remaining, RichText(SubFunction, 'term'));
					}
				}

			}
			// else if (!partialMatch(FunctionCall, Object.keys(domainObj)) && FunctionCall) {
			else {
				console.log('no!');
				// functioncall in term RT
				// pinputArray[1] = pinputArray[1].replace(FunctionCall, RichText(FunctionCall, 'term'));
				let remaining = '';
				for (let i = 1; i < tokens.length; i++) {
					remaining += tokens[i] + ' ';
					pinputArray[i] = pinputArray[i].replace(tokens[i], RichText(tokens[i], 'term'));
				}
			}
			// else {
			// }
		}  else {
			pinputArray[1] = pinputArray[1]?.replace(FunctionCall, RichText(FunctionCall, 'term'));
		}
	}

	// console.log(processedInput, pinputArray)
	processedInput = pinputArray.join(' ');
	// console.log(processedInput)



	
	console.log({processedInput})
	let ac = matches(nv, allPossibleCombinations(dobj));
	// only top 6 from ac
	// ac = ac.slice(0, 6);
	let generatedURI = generateTargetURI(dobj, processedInput)
	return {
		processedInput,
		autocomplete: ac,
		autocompleteFormatted: colourCoded(ac),
		generatedURI:generatedURI.URI,
		conflict: generatedURI.conflict
	};
}

interface URI {
	conflict: boolean,
	URI: string
}

export function _generateTargetURI(dobj:DomainObject, input:string):string {
	// if domain namespace has no matches, search with default domain g

	let URI = '';
	let terms = '';

	let [DomainNamespace, P2, P3, ...Terms] = input.split(' ');

	let domainObj = dobj.domains[DomainNamespace];
	if (typeof domainObj === 'string') {
		// terminates at domain namespace
		URI = domainObj;
		// collect terms
		terms = input.replace(DomainNamespace, '');
	} else if (typeof domainObj === 'object') {
		// check for functions
		if (P2 in domainObj) {
			URI = domainObj[P2];
			terms = P3 + ' ' + Terms.join(' ');
			// check for subfunctions
			if (typeof domainObj[P2] === 'object') {
				if (P3 in domainObj[P2]) {
					URI = domainObj[P2][P3];
					terms = Terms.join(' ');
				} else {
					// no subfunction; search with default behaviour
					URI = domainObj[P2]['DefaultBehaviour'];
					terms = P3 + ' ' + Terms.join(' ');
				}
			} else {
				// no subfunction; search with default behaviour
				URI = domainObj['DefaultBehaviour'];
				terms = input.replace(DomainNamespace, '');
			}
		} else {
			// no function; search with default behaviour
			URI = domainObj['DefaultBehaviour'];
			terms = input.replace(DomainNamespace, '');
		}

	} else {
		// no domain namespace
		// @ts-ignore
		URI = dobj.domains['g'].DefaultBehaviour;
		terms = input;
	}

	return URI.replace('$$', terms);
}

export function allPossibleCombinations(dobj:DomainObject, formatted = false): string[] {
	let combinations:string[] = [];
	Object.keys(dobj.domains).forEach((domain) => {
		const domainObj = dobj.domains[domain];
		if (typeof domainObj === 'object') {
			Object.keys(domainObj).forEach((func) => {
				if (typeof domainObj[func] === 'object') {
					Object.keys(domainObj[func]).forEach((subfunc) => {
						if (!formatted)
						combinations.push(`${domain} ${func.replace('DefaultBehaviour', '')} ${subfunc.replace('DefaultBehaviour', '')}`);
 						else
						// use rich text to colour the autocomplete
						combinations.push(
							`${RichText(domain, 'namespace')} ${RichText(func.replace('DefaultBehaviour', ''), 'fn')} ${RichText(subfunc.replace('DefaultBehaviour', ''), 'subq')}`
						);
					});
				} else {
					if (!formatted)
					combinations.push(`${domain} ${func.replace('DefaultBehaviour', '')}`);
					else
					combinations.push(
						`${RichText(domain, 'namespace')} ${RichText(func.replace('DefaultBehaviour', ''), 'fn')}`
					);
				}
			});
		} else {
			if (!formatted)
			combinations.push(`${domain}`);
		else
			combinations.push(
				`${RichText(domain, 'namespace')}`
			);
		}
	});
	// console.log(combinations)
	return combinations;
}

export function HTMLtoObject (html:string):Object {
	// convert html string to object
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const obj = {};

	// span objects; key is class, value is text
	const spans = doc.getElementsByTagName('span');
	for (let i = 0; i < spans.length; i++) {
		const span = spans[i];

		if(!span.className.includes('autocomplete')) {
			let key = span.className.replace('RT-', '');
			// @ts-ignore
			if (obj[key]) {
				// @ts-ignore
				obj[key] += ' ' + span.textContent;
			} else
			// @ts-ignore
			obj[key] = span.textContent;
		}
}

if (Object.keys(obj).length == 0) {
		// @ts-ignore
		obj['term'] = html.split('<span')[0];
	}

	return obj;
}

export function generateTargetURI(dobj:DomainObject, processedInput:string): URI {
	// use span objects to split and process tokens
	const obj = HTMLtoObject(processedInput);

	// if domain namespace has no matches, search with default domain g
	
	let URI = '';
	let terms = '';

	// @ts-ignore
	let DomainNamespace = obj['namespace'];
	// @ts-ignore
	let fn = obj['fn'];
	// @ts-ignore
	let subq = obj['subq'];
	// @ts-ignore
	let term = obj['term'];


	// generic search with default
	if (!DomainNamespace) {
		// @ts-ignore
		URI = dobj.domains['g'].DefaultBehaviour;
		terms = term;
	}
	// domain namespace
	else if (DomainNamespace) {
		// no function
		if (!fn) {
			// @ts-ignore
			// if domain namespace is a string
			if (typeof dobj.domains[DomainNamespace] === 'string') {
				// @ts-ignore
				URI = dobj.domains[DomainNamespace];
				terms = term;
			} else {
				URI = dobj.domains[DomainNamespace].DefaultBehaviour;
				terms = term;
			}
		}
		// function call
		else if (fn) {
			// no subfunction
			if (!subq) {
				// @ts-ignore
				URI = dobj.domains[DomainNamespace][fn].DefaultBehaviour;
				terms = term;
			}
			// subfunction
			else if (subq) {
				// @ts-ignore
				URI = dobj.domains[DomainNamespace][fn][subq];
				terms = term;
			}
		}
	}

	let conflict = false;

	if (URI)
		if (subq && !terms) conflict = true;
	if (URI)
		if (URI.includes('$$') && !terms) conflict = true;
	if (URI)
		if (!URI.includes('$$') && !terms) conflict = false;
	
	if (Object.values(obj).join(' ').trim().length == 0) conflict = false;
	
	console.log(URI)
	
	if (URI)
	console.log(terms, URI.replace('$$', terms).replace(' ', '%20'), conflict);
	if (URI && !conflict) {
		return {URI: URI.replace('$$', terms).replace(' ', '%20'), conflict:conflict};
	} else if (URI && conflict) {
		console.log(obj)
		return {URI: URI.replace('$$', Object.values(obj).join(' ')).replace(' ', '%20'), conflict:conflict};
	}
	else {
		// @ts-ignore
		return { URI: dobj.domains['g'].DefaultBehaviour.replace('$$', Object.values(obj).join(' ')).replace(' ', '%20'), conflict };
	}
}

// interface URI {
// 	protocol: string;
// 	host: string;
// }
export interface MultiFunctionalDomain {
	DefaultBehaviour: string;
	[FunctionCaller: string]: string;
}

export interface DomainObject {
	domains: {
		[DomainNamespace: string]: MultiFunctionalDomain | string;
	}
}
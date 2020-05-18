const TypeErr = (arg: string, expected: string, received: string): TypeError => new TypeError(`TypeError: Argument "${arg}" expected type ${expected}. Got ${received}`);
export {TypeErr}
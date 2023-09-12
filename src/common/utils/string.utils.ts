/**
 * Throws a error if the provided value is not a string.
 * Otherwise returns the string
 * @throws { Error }
 */
export function mustBeStringOrFail(value?: string) {
    if (typeof value == "string") return value;
    throw new Error("Provided value must be a string.")
}
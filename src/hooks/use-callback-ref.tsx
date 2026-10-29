// oxlint-disable typescript/no-unsafe-type-assertion
import * as React from "react";

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/use-callback-ref/src/useCallbackRef.tsx
 */

/**
 * A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency
 */
// `never[]` (not `unknown[]`) is the sound way to constrain "any function":
// `never` is assignable to every type, so specific-typed callbacks such as
// `(state: T) => void` satisfy the constraint. With `unknown[]` the parameter
// is contravariant and `(state: T) => void` is rejected, since `unknown` is
// not assignable to `T`.
function useCallbackRef<T extends (...args: never[]) => unknown>(
	callback: T | undefined
): T {
	const callbackRef = React.useRef<T | undefined>(callback);

	// Intentionally no dependency array - we want to update the ref on every render
	// so the latest callback is always available. This is safe because we're only
	// updating a ref, not triggering side effects.
	React.useEffect(() => {
		callbackRef.current = callback;
	});

	// https://github.com/facebook/react/issues/19240
	return React.useMemo(
		() =>
			((...args: Parameters<T>) => {
				const fn = callbackRef.current;
				return fn ? fn(...args) : undefined;
			}) as T,
		[]
	);
}

export { useCallbackRef };

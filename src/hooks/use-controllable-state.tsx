import * as React from "react";

import { useCallbackRef } from "./use-callback-ref";

interface UseControllableStateParams<T> {
	prop?: T | undefined;
	defaultProp?: T | undefined;
	onChange?: (state: T) => void;
}

/**
 * State setter accepted by `useControllableState`. Mirrors
 * `React.Dispatch<React.SetStateAction<T | undefined>>`, but never
 * invokes `onChange` with `undefined`.
 */
type SetStateFn<T> = (
	nextValue: T | undefined | ((prevState: T | undefined) => T | undefined)
) => void;

function isUpdater<T>(
	value: T | undefined | ((prevState: T | undefined) => T | undefined)
): value is (prevState: T | undefined) => T | undefined {
	return typeof value === "function";
}

function useControllableState<T>({
	prop,
	defaultProp,
	onChange
}: UseControllableStateParams<T>) {
	const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
		defaultProp,
		onChange
	});
	const isControlled = prop !== undefined;
	const value = isControlled ? prop : uncontrolledProp;
	const handleChange = useCallbackRef(onChange);

	const setValue = React.useCallback<SetStateFn<T>>(
		nextValue => {
			if (isControlled) {
				const resolvedValue = isUpdater(nextValue)
					? nextValue(prop)
					: nextValue;
				if (resolvedValue !== prop && resolvedValue !== undefined) {
					handleChange(resolvedValue);
				}
			} else {
				setUncontrolledProp(nextValue);
			}
		},
		[isControlled, prop, setUncontrolledProp, handleChange]
	);

	return [value, setValue] as const;
}

function useUncontrolledState<T>({
	defaultProp,
	onChange
}: {
	defaultProp?: T | undefined;
	onChange?: ((state: T) => void) | undefined;
}) {
	const [value, setValue] = React.useState<T | undefined>(defaultProp);
	const prevValueRef = React.useRef(value);
	const handleChange = useCallbackRef(onChange);

	React.useEffect(() => {
		if (prevValueRef.current !== value && value !== undefined) {
			handleChange(value);
			prevValueRef.current = value;
		}
	}, [value, handleChange]);

	return [value, setValue] as const;
}

export { useControllableState };

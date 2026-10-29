---

title: Quick Start
id: quick-start
---

TanStack Store is, first and foremost, a framework-agnostic signals implementation.

It can be used with any of our framework adapters, but can also be used in vanilla JavaScript or TypeScript. It's currently used to power many of our library's internals.

## Store

You'll start by creating a new store instance, which is a wrapper around your data:

```typescript
import { createStore } from "@tanstack/store";

const countStore = createStore(0);

console.log(countStore.state); // 0
countStore.setState(() => 1);
console.log(countStore.state); // 1
```

This `Store` can then be used to track updates to your data:

```typescript
const { unsubscribe } = countStore.subscribe(() => {
	console.log("The count is now:", countStore.state);
});

// Later, to cleanup
unsubscribe();
```

### Batch Updates

You can batch updates to a store by using the `batch` function:

```typescript
import { batch } from "@tanstack/store";

// countStore.subscribers will only trigger once at the end with the final state
batch(() => {
	countStore.setState(() => 1);
	countStore.setState(() => 2);
});
```

## Derived Stores

You can create derived stores that automatically update when their dependencies change:

```typescript
const count = createStore(0);

const double = createStore(() => count.state * 2);

console.log(double.state); // 0
count.setState(() => 5);
console.log(double.state); // 10
```

### Previous Derived Value

You can access the previous value of a derived computation by using the `prev` argument passed to the function:

```typescript
const count = createStore(1);

const sum = createStore<number>(prev => {
	return count.state + (prev ?? 0);
});

console.log(sum.state); // 1
count.setState(() => 2);
console.log(sum.state); // 3
```

## Subscriptions

You can subscribe to store changes to perform side effects:

```typescript
const count = createStore(0);

const { unsubscribe } = count.subscribe(state => {
	console.log("The count is now:", state);
});

count.setState(() => 5); // Logs: "The count is now: 5"

// Later, to cleanup
unsubscribe();
```

---

title: Quick Start
id: quick-start
---

The basic react app example to get started with the TanStack react-store.

```tsx
import { createStore, useSelector } from "@tanstack/react-store";
import React from "react";
import ReactDOM from "react-dom/client";

// You can instantiate the store outside of React components too!
export const store = createStore({
	dogs: 0,
	cats: 0
});

// This will only re-render when `state[animal]` changes. If an unrelated store property changes, it won't re-render

const Display = ({ animal }) => {
	const count = useSelector(store, state => state[animal]);
	return <div>{`${animal}: ${count}`}</div>;
};

const updateState = animal => {
	store.setState(state => {
		return {
			...state,
			[animal]: state[animal] + 1
		};
	});
};
const Increment = ({ animal }) => (
	<button onClick={() => updateState(animal)}>My Friend Likes {animal}</button>
);

function App() {
	return (
		<div>
			<h1>How many of your friends like cats or dogs?</h1>
			<p>
				Press one of the buttons to add a counter of how many of your friends
				like cats or dogs
			</p>
			<Increment animal='dogs' />
			<Display animal='dogs' />
			<Increment animal='cats' />
			<Display animal='cats' />
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```

## `useStore` remains available as a deprecated alias to `useSelector`.

id: "@tanstack/store"
title: "@tanstack/store"
---

## Classes

- [ReadonlyStore](classes/ReadonlyStore.md)
- [Store](classes/Store.md)

## Interfaces

- [Atom](interfaces/Atom.md)
- [AtomOptions](interfaces/AtomOptions.md)
- [BaseAtom](interfaces/BaseAtom.md)
- [InternalBaseAtom](interfaces/InternalBaseAtom.md)
- [InternalReadonlyAtom](interfaces/InternalReadonlyAtom.md)
- [InteropSubscribable](interfaces/InteropSubscribable.md)
- [Readable](interfaces/Readable.md)
- [ReadonlyAtom](interfaces/ReadonlyAtom.md)
- [Subscribable](interfaces/Subscribable.md)
- [Subscription](interfaces/Subscription.md)

## Type Aliases

- [AnyAtom](type-aliases/AnyAtom.md)
- [Observer](type-aliases/Observer.md)
- [Selection](type-aliases/Selection.md)
- [StoreAction](type-aliases/StoreAction.md)
- [StoreActionMap](type-aliases/StoreActionMap.md)
- [StoreActionsFactory](type-aliases/StoreActionsFactory.md)

## Functions

- [batch](functions/batch.md)
- [compareDeep](functions/compareDeep.md)
- [compareShallow](functions/compareShallow.md)
- [createAsyncAtom](functions/createAsyncAtom.md)
- [createAtom](functions/createAtom.md)
- [createStore](functions/createStore.md)
- [flush](functions/flush.md)
- [shallow](functions/shallow.md)
- [toObserver](functions/toObserver.md)

---
id: react
name: "React (Web) Conventions"
whenToUse: |
  Layer on top of the engineering disciplines when the TARGET project is a React web app
  (Vite, Next.js, Remix, CRA). Component, hook, and state idioms.
  NOT for: React Native (see react-native), test strategy (see testing).
version: "1.0.0"
---

# React (Web) Conventions — Best Practices

## Core Principles

1. **Function components and hooks only.** Follow the Rules of Hooks: call them at the top level, unconditionally, in the same order every render. No hooks in loops/conditions.

2. **Derive, don't duplicate.** If a value can be computed from props or existing state, compute it during render — don't copy it into another `useState`. Duplicated state drifts out of sync.

3. **You might not need an effect.** Effects are for synchronizing with *external* systems (network, subscriptions, the DOM). Derived data and event responses belong in render or event handlers, not `useEffect`. Every effect must clean up what it sets up.

4. **Lift state to the lowest common ancestor** that needs it — and no higher. Colocate state with the component that uses it; reach for Context only when prop drilling genuinely hurts.

5. **Stable keys, never the array index** for dynamic/reorderable lists — index keys corrupt state and identity on insert/remove.

6. **Memoize only when measured.** `useMemo`/`useCallback`/`memo` add complexity; apply them to real, profiled hot paths, not preemptively.

7. **Accessibility is not optional.** Semantic elements over `div` soup; `label`/`htmlFor`; roles and keyboard handling. The component works for everyone or it's unfinished.

## Methodology

1. Detect the framework (Vite/Next/Remix), styling system (CSS modules/Tailwind/styled), and state lib (Context/Redux/Zustand) — and match them.
2. Fetch data outside render (a data library, or an effect with a cleanup/race guard) — never in the render body.
3. Type props with TypeScript; avoid `any`. Prefer discriminated unions for variant props.
4. Test with React Testing Library: query by role/text, assert observable behavior — not internal state or implementation details.

## Anti-Patterns

- A `useEffect` that only syncs derived state (compute it instead).
- Index keys on dynamic lists; effects without cleanup (races, leaks).
- 500-line components doing fetch + state + layout; split by responsibility.
- Reaching for global state/Redux when local state or Context suffices.

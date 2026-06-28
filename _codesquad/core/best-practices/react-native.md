---
id: react-native
name: "React Native Conventions"
whenToUse: |
  Layer on top of the engineering disciplines (and React conventions) when the TARGET is a
  React Native mobile app (Expo or bare). Mobile-specific idioms, performance, and gates.
  NOT for: React web (see react), test strategy (see testing).
version: "1.0.0"
---

# React Native Conventions — Best Practices

## Core Principles

1. **RN is not the web.** No DOM, no HTML, no CSS files. Use core components (`View`, `Text`, `Image`, `Pressable`, `ScrollView`) and `StyleSheet.create`. Text only renders inside `<Text>`. Styles are JS objects (numbers, not `"12px"`).

2. **Plan for two platforms.** Branch with `Platform.OS` / `Platform.select`, or split files (`Component.ios.tsx` / `Component.android.tsx`). Test the difference (safe areas, back button, status bar) — don't assume iOS == Android.

3. **Long lists use `FlatList`/`SectionList`, never `.map`.** Virtualization keeps memory and scroll smooth. Always give a stable `keyExtractor`; add `getItemLayout` for fixed-height rows.

4. **Protect the JS thread.** It drives the UI — heavy synchronous work freezes the app. Defer with `InteractionManager`, and animate with `useNativeDriver: true` (or Reanimated) so animations run off-thread.

5. **Respect the device frame.** Use `SafeAreaView` / safe-area insets for notches and home indicators. Give images explicit dimensions. Handle the keyboard (`KeyboardAvoidingView`).

6. **Minimize bridge crossings; add native modules only when an API is missing.** Prefer existing community modules; a custom native module is a maintenance and build-complexity cost.

7. **Know your runtime: Expo (managed) vs bare** changes what native APIs and build steps are available. Read `package.json`/`app.json` before assuming an API exists.

## Methodology

1. Read `package.json`/`app.json` → RN version, Expo vs bare, navigation lib (React Navigation — type your routes), state lib. Match them.
2. Keep platform-specific code isolated behind `Platform`/file splits, not scattered.
3. **Unit gate is `npm test`** (Jest + `@testing-library/react-native`); e2e is Detox/Maestro.
4. The native build (Metro + Xcode/Gradle) is a separate, slow, out-of-band gate — don't block logic verification on a device build.

## Anti-Patterns

- Web habits: `div`/`className`, `"10px"` strings, CSS files.
- `.map` over a large array instead of `FlatList`; animating without the native driver.
- Blocking the JS thread with synchronous loops/JSON work.
- Verifying logic through the native build instead of the Jest unit gate.

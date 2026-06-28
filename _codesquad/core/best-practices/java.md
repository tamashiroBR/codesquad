---
id: java
name: "Java & JVM Conventions"
whenToUse: |
  Layer on top of the engineering disciplines when the TARGET project is Java/Kotlin on the
  JVM (Spring Boot, Jakarta, Android backend). Stack-specific idioms and gates.
  NOT for: choosing test strategy (see testing), reviewing diffs (see code-review).
version: "1.0.0"
---

# Java & JVM Conventions — Best Practices

## Core Principles

1. **The build tool is the source of truth.** Read `pom.xml` / `build.gradle` first to learn the Java version (17/21), framework (Spring Boot? Jakarta vs `javax`?), and test stack (JUnit 4 vs 5). Run gates through it (`mvn -B test`, `./gradlew test`) — never invent commands or bypass the wrapper.

2. **Prefer immutability.** `final` fields, constructor-set state, and `record` for data carriers. Immutable objects are thread-safe by construction and remove a whole class of bugs.

3. **Null is a boundary concern.** Use `Optional` as a return type at API edges; never as a field or parameter. Inside a module, keep invariants so null can't appear, rather than null-checking everywhere.

4. **Exceptions carry intent.** Unchecked exceptions for programming errors; checked only where the caller can realistically recover. Never swallow (`catch (Exception e) {}`) — handle, wrap with context, or rethrow.

5. **Constructor injection, layered design.** In Spring, inject through the constructor (testable, final, no reflection surprises) — not field injection. Keep controller → service → repository boundaries; no business logic in controllers.

6. **Use the standard concurrency toolkit.** Reach for `java.util.concurrent` (executors, `CompletableFuture`, concurrent collections) before raw threads or `synchronized`. Avoid shared mutable static state.

7. **Streams for transformation, loops for clarity.** Streams shine for map/filter/collect pipelines; a plain loop is fine when it reads better. Don't force either.

## Methodology

1. Read the build file → pin Java version, framework, JUnit version, and module layout.
2. Match the existing package structure (package-by-feature beats package-by-layer for cohesion).
3. Manage resources with try-with-resources; close everything that's `AutoCloseable`.
4. Test with JUnit 5 + AssertJ (readable assertions) + Mockito (boundaries); Testcontainers for real integration.
5. Gate with `mvn -B test` / `./gradlew test`; the compile step is your typecheck.

## Anti-Patterns

- Catching `Exception`/`Throwable` broadly, or swallowing exceptions silently.
- Returning `null` for collections (return empty) or using `Optional` as a field.
- Field injection (`@Autowired` on fields) and business logic in controllers.
- Mutable `static` state; manual thread management where an executor fits.

import { Article } from "../entities/Article";
import { Category } from "../entities/Category";
import db, { clearDB } from "./index";

async function main() {
  await db.initialize();
  await clearDB();

  const react = Category.create({ name: "React" });
  await react.save();

  const typescript = Category.create({ name: "TypeScript" });
  await typescript.save();

  const node = Category.create({ name: "Node.js" });
  await node.save();

  const articles = [
    {
      title: "A Complete Guide to React Hooks",
      body: `React Hooks revolutionized how we write React components, introduced in React 16.8 to allow functional components to use state and lifecycle features previously only available in class components. The useState hook is the most fundamental, allowing you to add state to functional components by declaring state variables that persist across renders. When you call useState, it returns an array with the current state value and a function to update it, enabling you to trigger re-renders when data changes.

The useEffect hook handles side effects in functional components, replacing lifecycle methods like componentDidMount, componentDidUpdate, and componentWillUnmount. It runs after every render by default, but you can control when it executes by passing a dependency array as the second argument. An empty array means it only runs once on mount, while including specific dependencies ensures it only re-runs when those values change. The cleanup function returned from useEffect is perfect for unsubscribing from events or canceling API requests.

useContext provides a way to pass data through the component tree without prop drilling at every level. You create a context using React.createContext, then use the Provider component to wrap parts of your app where the context should be available. Child components can access this data using useContext, making it ideal for themes, user authentication, or language preferences. This approach significantly cleans up your component hierarchy and makes data flow more explicit.

Custom hooks allow you to extract component logic into reusable functions that can use other hooks. By convention, custom hooks start with "use" and can encapsulate complex logic like form handling, API calls, or animation controls. They follow the same rules as regular hooks - only call hooks at the top level of your function and only from React functions. Custom hooks promote code reuse and separation of concerns, making your components cleaner and more focused on presentation.

The Rules of Hooks are essential to follow: only call hooks from React function components or custom hooks, and always call them in the same order every render. ESLint plugins can help enforce these rules automatically. Understanding closure stale issues is crucial - when a callback references state from a previous render, you might need to use functional updates or refs to access current values. Mastering these patterns will make you a more effective React developer.

Additional hooks like useReducer offer an alternative to useState for complex state logic, especially when state transitions depend on previous values or involve multiple sub-values. useMemo and useCallback optimize performance by memoizing expensive computations and callback functions. useRef creates mutable references that persist across renders without causing re-renders, perfect for accessing DOM elements or storing previous values. These advanced hooks give you fine-grained control over component behavior and performance.`,
      category: react,
      mainPictureUrl:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    },
    {
      title: "Understanding React Server Components",
      body: `React Server Components represent a paradigm shift in how we build React applications, enabling components to render exclusively on the server and stream HTML to the client. Unlike traditional server-side rendering which hydrates interactive components on the client, Server Components never ship JavaScript to the browser, resulting in zero client-side bundle size increase. This architecture allows you to access server-side resources like databases and file systems directly from your components without exposing sensitive connection strings or logic to the client.

The mental model for Server Components requires understanding the distinction between server and client boundaries. Server Components can import and render Client Components, but Client Components cannot import Server Components - they can only receive them as children through props. This one-way data flow ensures that server-only code never leaks into the client bundle. When a Client Component needs server data, you pass it via props from a parent Server Component rather than fetching it directly.

Data fetching in Server Components happens naturally during render, eliminating the need for useEffect data fetching patterns. You can write async components that await database queries, API calls, or file system operations directly in your component body. This synchronous-looking code actually runs on the server, with React streaming the HTML as it becomes ready. Error boundaries and loading states work seamlessly with Suspense to provide progressive enhancement of your UI.

Streaming is a core benefit of the Server Components architecture. Instead of waiting for all data to load before sending HTML, React can send a loading shell immediately and stream in content as it resolves. This dramatically improves Time to First Byte and perceived performance. The streaming protocol handles out-of-order responses gracefully, ensuring your UI remains consistent even when data arrives unpredictably. This approach is particularly powerful for pages with multiple independent data sources.

Caching and revalidation strategies integrate naturally with Server Components. You can cache component renders at the edge using CDN configurations, with fine-grained control over cache duration and invalidation triggers. ISR (Incremental Static Regeneration) patterns allow you to serve stale content instantly while regenerating fresh data in the background. This hybrid approach combines the performance of static sites with the freshness of dynamic rendering.

The ecosystem around Server Components continues to evolve with frameworks like Next.js 13+ and Remix providing production-ready implementations. These frameworks handle the complexity of bundling, routing, and streaming while exposing simple APIs for developers. Understanding Server Components is becoming essential for modern React development, offering a path to better performance, simpler data fetching, and improved security architectures. The future of React lies in this server-first approach that optimizes for both developer experience and user performance.`,
      category: react,
      mainPictureUrl:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    },
    {
      title: "State Management in React: Redux vs Context vs Zustand",
      body: `Choosing the right state management solution can make or break your React application, affecting everything from bundle size to developer productivity and runtime performance. Redux has been the gold standard for years, providing predictable state updates through actions and reducers with excellent DevTools support. Its strict unidirectional data flow makes debugging straightforward, and the middleware ecosystem offers powerful capabilities like logging, crash reporting, and async handling through Redux Thunk or Redux Saga.

However, Redux comes with significant boilerplate and a steep learning curve. Every state change requires defining action types, action creators, and reducers, which can feel cumbersome for simple applications. The Redux team addressed this with Redux Toolkit, which reduces boilerplate through conventions and utilities like createSlice and configureStore. Despite these improvements, Redux often feels like overkill for apps that don't need time-travel debugging or complex state orchestration.

React Context combined with useReducer offers a built-in alternative for state management without additional dependencies. Context excels at dependency injection - passing data through the component tree without prop drilling. However, it's not optimized for high-frequency updates since any context change triggers re-renders of all consuming components. For global state that changes frequently, Context can cause performance issues that are hard to optimize without memoization strategies.

Zustand has emerged as a lightweight, modern alternative that provides Redux-like capabilities with minimal boilerplate. It uses a simple store pattern with hooks-based API, requiring no providers or wrappers. Zustand's philosophy emphasizes simplicity and performance, with automatic batching of updates and selective subscriptions that prevent unnecessary re-renders. The API is intuitive - create a store, define actions as functions, and use the hook in components.

Other alternatives worth considering include Recoil for atomic state management with fine-grained subscriptions, Jotai which takes a similar atomic approach with a simpler API, and Valtio for proxy-based state management that feels like working with plain objects. Each solution has tradeoffs in learning curve, bundle size, DevTools support, and ecosystem maturity. For server state specifically, TanStack Query (React Query) and SWR offer specialized solutions that handle caching, synchronization, and background updates.

The best choice depends on your specific needs: Redux for complex applications requiring time-travel debugging and strict architectural patterns; Context for simple dependency injection and low-frequency updates; Zustand for most applications needing global state without Redux complexity; and specialized libraries for server state. Many modern applications use a combination - Context for themes and auth, Zustand for UI state, and TanStack Query for server data. Understanding these tradeoffs allows you to select the right tool for each job rather than defaulting to the most popular option.`,
      category: react,
      mainPictureUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    },
    {
      title: "Mastering TypeScript Generics",
      body: `Generics allow you to write reusable, type-safe code that works with multiple types while maintaining compile-time type checking. They provide a way to parameterize types, functions, and classes so they can operate on various data types without losing type information. The syntax uses angle brackets with type parameters, typically named T, U, or V by convention, though descriptive names like UserType or ResponseData improve readability in complex scenarios.

Generic functions enable you to write utility functions that work with any type while preserving type information through the call chain. A classic example is an identity function that returns whatever type it receives. Without generics, you'd use any and lose type safety. With generics, TypeScript infers the type from the argument and maintains it through the return value. This enables autocomplete, type checking, and refactoring support that would be impossible with any.

Generic constraints allow you to limit which types can be used with your generic code. Using the extends keyword, you can require that type parameters have certain properties or extend specific interfaces. This is crucial when your generic code needs to access specific properties or methods on the type. For example, a function that logs a name property might constrain T to extend { name: string }, ensuring type safety while maintaining flexibility for any object with a name.

Conditional types take generics to the next level by allowing type definitions that change based on input types. Using the ternary operator syntax within type definitions, you can create sophisticated type mappings that transform types conditionally. The built-in utility types like Exclude, Extract, and ReturnOf use conditional types extensively. Understanding infer within conditional types enables you to extract and manipulate type information in powerful ways.

Generic classes and interfaces support object-oriented patterns with type safety. A generic Stack<T> class can store and retrieve values of type T, with methods like push and pop properly typed. Generic interfaces define contracts that work across types, like React's Component<P, S> which accepts props and state types. Mapped types allow you to create new types by transforming properties of existing types, useful for making all properties optional (Partial) or readonly (Readonly).

Advanced patterns include generic type inference from function arguments, variadic tuple types for handling rest parameters, and template literal types for string manipulation. Understanding variance (covariant, contravariant, invariant) helps predict how generic types relate to their type parameters. The TypeScript standard library demonstrates sophisticated generic usage worth studying. Mastering generics transforms TypeScript from a simple type checker into a powerful tool for building robust, maintainable type systems that catch errors at compile time and enable confident refactoring of complex codebases.`,
      category: typescript,
      mainPictureUrl:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    },
    {
      title: "TypeScript Best Practices for 2024",
      body: `Modern TypeScript patterns and best practices that will make your code more maintainable and catch errors at compile time have evolved significantly as the language matures. Strict mode should be enabled in every project, turning on all strict type-checking options that help catch common errors. This includes noImplicitAny, strictNullChecks, strictFunctionTypes, and several others that enforce rigorous type safety. The initial migration may require fixing many type errors, but the long-term benefits in code quality and refactoring confidence are substantial.

Prefer interfaces over type aliases for object shapes that might be extended or implemented. Interfaces support declaration merging, allowing multiple declarations with the same name to be combined, which is useful for extending third-party types or organizing large type definitions. Type aliases are better for unions, intersections, mapped types, and complex type transformations. Understanding when to use each construct leads to cleaner, more maintainable type definitions.

Use explicit return types for public API functions and complex functions, but allow TypeScript to infer types for simple internal functions. Explicit return types serve as documentation and catch errors when implementation changes unexpectedly. They also improve compiler performance by helping TypeScript narrow types faster. However, excessive type annotations add noise without value - find the balance that makes your code self-documenting without becoming verbose.

Never use any unless absolutely necessary, and prefer unknown when you genuinely don't know a type. unknown is the type-safe counterpart to any - it requires type narrowing before you can use the value. Use type guards, assertions, or validation libraries to narrow unknown to specific types. The eslint rule @typescript-eslint/no-explicit-any helps enforce this practice and can be configured to allow any only in specific situations with explanatory comments.

Leverage discriminated unions for modeling state machines and complex conditional types. By including a discriminant property like type or kind, you enable TypeScript to narrow unions automatically through control flow analysis. This pattern is powerful for Redux actions, API responses, and component state management. Exhaustiveness checking with never ensures you handle all cases in switch statements, catching missing cases at compile time.

Modern TypeScript projects benefit from organized type definitions, typically in dedicated types.ts or interfaces.ts files or co-located with the code they describe. Use path mapping in tsconfig.json for clean imports. Leverage utility types like Partial, Required, Pick, Omit, and Record instead of redefining similar shapes. Enable exactOptionalPropertyTypes to distinguish between undefined and missing properties. Use satisfies for type checking without widening. These practices, combined with consistent naming conventions and comprehensive JSDoc comments, create a type-safe foundation that scales with your codebase and team size.`,
      category: typescript,
      mainPictureUrl:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
    },
    {
      title: "Using TypeScript Decorators in Node.js",
      body: `Decorators provide a way to add metadata and behavior to classes and methods, originally proposed for ECMAScript but widely used in TypeScript for frameworks like NestJS, TypeORM, and class-validator. They are experimental features enabled by setting experimentalDecorators in tsconfig.json, allowing you to annotate classes, methods, accessors, properties, and parameters with metadata that can be reflected at runtime using the reflect-metadata package. This pattern enables declarative programming where you express intent through annotations rather than imperative code.

Class decorators receive the class constructor as their target and can replace or extend the class definition. They're commonly used for dependency injection containers, marking classes as injectable, or adding metadata for routing in web frameworks. Method decorators receive the target prototype, property key, and property descriptor, allowing you to modify method behavior, add logging, implement caching, or handle authorization checks. The descriptor object provides control over the method's enumerability, configurability, and the actual function implementation.

Property decorators are simpler, receiving only the target and property key, making them useful for metadata annotation without behavior modification. Parameter decorators receive the target, property key, and parameter index, commonly used with method decorators to implement dependency injection by marking constructor parameters for injection. The combination of these decorator types enables powerful declarative APIs that reduce boilerplate and improve code readability.

Practical applications include validation logic where property decorators define constraints like @IsString(), @IsEmail(), or @MinLength(8), and class-validator applies these constraints when validating objects. ORMs like TypeORM use decorators to map classes to database tables (@Entity()), properties to columns (@Column()), and relationships (@OneToMany(), @ManyToOne()). Web frameworks like NestJS use decorators for routing (@Controller(), @Get(), @Post()), dependency injection (@Injectable(), @Inject()), and middleware (@UseGuards(), @UseInterceptors()).

Decorator composition allows multiple decorators to be applied to a single declaration, executing from top to bottom for class/method decorators but evaluating decorator expressions from bottom to top. Understanding this ordering is crucial when decorators depend on each other. Decorator factories are functions that return decorator functions, enabling parameterized decorators like @Log('verbose') or @Cache(300). This pattern adds flexibility while maintaining the clean declarative syntax.

While decorators remain experimental in TypeScript, they have proven so valuable that the TC39 committee is working on a standardized version with slightly different semantics. TypeScript 5.0 introduced support for the new decorators specification while maintaining backward compatibility with the legacy implementation. When using decorators, ensure proper metadata reflection setup, understand the execution order, and be mindful of the experimental status. For production applications, consider whether the productivity gains outweigh the risks of using experimental features, and have a migration plan if the standard changes significantly.`,
      category: typescript,
      mainPictureUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    },
    {
      title: "Building a REST API with Node.js and Express",
      body: `A comprehensive guide to building scalable REST APIs with Express.js, including routing, middleware, and error handling. Express remains the most popular Node.js web framework due to its minimalist design, extensive middleware ecosystem, and flexibility to structure applications as needed. The foundation of any Express app is the application object created by calling express(), which provides methods for configuring middleware, defining routes, and starting the HTTP server.

Routing in Express is handled through methods corresponding to HTTP verbs - app.get(), app.post(), app.put(), app.delete(), etc. Route handlers accept request and response objects plus an optional next function for middleware chaining. Express supports route parameters (app.get('/users/:id')), query strings (req.query), and pattern matching for flexible URL handling. Organizing routes using Express Router enables modular route definitions that can be mounted at specific paths, improving code organization in large applications.

Middleware functions are the heart of Express, executing in the order they're defined for every request that matches their path. They can modify the request and response objects, end the request-response cycle, or call next() to pass control to subsequent middleware. Common middleware categories include logging (morgan), body parsing (express.json(), express.urlencoded()), authentication (passport, JWT verification), and error handling. Custom middleware follows the same signature and can encapsulate cross-cutting concerns like request validation, rate limiting, or CORS handling.

Error handling in Express requires special attention because unhandled promise rejections in async route handlers crash the server by default. Wrap async route handlers in a utility function that catches errors and passes them to Express's error-handling middleware. Error-handling middleware has a signature with four parameters (err, req, res, next) and should be defined last. Implement centralized error handling that distinguishes between operational errors (bad requests, not found) and programming errors, returning appropriate HTTP status codes and messages.

Validation ensures data integrity and prevents security vulnerabilities. Use libraries like express-validator or Joi to validate and sanitize request bodies, parameters, and query strings. Define validation schemas declaratively and apply them as middleware before route handlers. Consistent validation patterns across your API improve security and provide clear error messages to API consumers. Sanitize inputs to prevent injection attacks and XSS vulnerabilities.

Production readiness requires additional considerations: implement rate limiting to prevent abuse, use helmet middleware for security headers, enable compression for responses, and configure proper logging with structured formats like JSON. Database connections should use connection pooling, and sensitive configuration belongs in environment variables, never in code. Testing Express apps with supertest enables integration testing of routes without starting a real server. Document your API using OpenAPI/Swagger specifications that can be served alongside your application. Following these practices creates maintainable, secure, and scalable REST APIs that serve as robust backends for modern applications.`,
      category: node,
      mainPictureUrl:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    },
    {
      title: "Implementing JWT Authentication in Node.js",
      body: `Learn how to implement secure authentication using JSON Web Tokens, including refresh tokens and token rotation strategies. JWT authentication has become the standard for stateless authentication in modern web applications, allowing servers to verify user identity without maintaining session state. A JWT consists of three parts: a header containing metadata and algorithm information, a payload with claims (user data and expiration), and a signature that verifies the token hasn't been tampered with. The token is encoded as base64url strings separated by dots, making it URL-safe and easy to transmit.

The authentication flow begins with the client sending credentials (username/password) to a login endpoint. The server validates these credentials against a database, typically comparing hashed passwords using bcrypt or argon2. Upon successful validation, the server generates an access token and refresh token pair. The access token has a short expiration (15-30 minutes) and contains minimal user information like userId and roles. The refresh token has a longer expiration (days or weeks) and is stored securely in an httpOnly cookie or secure storage on the client.

Access tokens are sent with each API request, typically in the Authorization header using the Bearer scheme. Server middleware validates the token signature using a secret key or public key, verifies it hasn't expired, and extracts the user claims for use in route handlers. Never store sensitive information in JWT payloads as they're base64 encoded (not encrypted) and can be decoded by anyone. If tokens are compromised, implement token blacklisting or short expiration times to limit damage.

Refresh tokens provide a mechanism to obtain new access tokens without re-authenticating with credentials. When an access token expires, the client sends the refresh token to a dedicated endpoint that validates it and issues a new access token. Refresh tokens should be single-use - when used to obtain a new access token, generate a new refresh token as well (token rotation). Store refresh tokens in a database with metadata like userId, expiration, and device information to enable revocation if compromise is suspected.

Security best practices include using strong signing algorithms (HS256 or RS256, never none), keeping secret keys secure using environment variables or secret management services, implementing proper CORS policies, and using HTTPS exclusively. Set appropriate expiration times - short for access tokens to limit window of compromise, longer but revocable for refresh tokens. Consider adding token versioning or jti (JWT ID) claims to enable server-side revocation. Rate limit authentication endpoints to prevent brute force attacks.

Implementation patterns vary by framework. In Express, create authentication middleware that extracts and validates tokens, attaching user information to the request object. Handle token expiration gracefully by checking expiry before processing and returning 401 responses with clear error messages. For password reset flows, use time-limited signed tokens or one-time codes instead of JWTs. When logging out, invalidate refresh tokens server-side and clear cookies. Comprehensive JWT implementation requires attention to token lifecycle management, secure storage, and graceful handling of expiration scenarios across all client types including web, mobile, and API consumers.`,
      category: node,
      mainPictureUrl:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop",
    },
    {
      title: "Optimizing Node.js Performance",
      body: `Tips and techniques for improving your Node.js application performance, including clustering, caching, and profiling. Node.js runs on a single thread with an event loop, which provides excellent performance for I/O-bound operations but can become a bottleneck for CPU-intensive tasks. Understanding the event loop phases - timers, I/O callbacks, idle/prepare, poll, check, and close callbacks - helps you write non-blocking code that maximizes throughput. Blocking the event loop with synchronous operations causes request queuing and degraded performance.

Clustering enables you to utilize multiple CPU cores by spawning child processes that share the same server port. The cluster module creates a master process that forks worker processes, distributing incoming connections across available workers. This pattern scales Node.js applications to handle more concurrent requests without code changes. Implement graceful restarts where the master forks new workers before shutting down old ones, ensuring zero downtime deployments. Alternatively, use process managers like PM2 that handle clustering automatically with built-in monitoring and log rotation.

Caching strategies dramatically reduce database load and response times. Implement in-memory caching for frequently accessed data using libraries like node-cache or Redis for distributed caching across multiple server instances. Cache at multiple levels - database query results, API responses, and rendered views. Set appropriate TTL (time-to-live) values based on data volatility. Implement cache invalidation strategies to ensure data consistency, using techniques like write-through caching, cache-aside patterns, or event-driven invalidation. Redis excels as a caching layer due to its pub/sub capabilities and data structure support.

Database optimization significantly impacts application performance. Use connection pooling to reuse database connections instead of creating new connections per request. Index frequently queried columns and use query analyzers to identify slow queries. Implement pagination for large datasets rather than fetching everything at once. Consider read replicas for scaling read-heavy workloads. For MongoDB, use projection to return only needed fields and lean queries when you don't need Mongoose document methods. Batch operations to reduce round-trips to the database.

Profiling and monitoring identify performance bottlenecks. Use the built-in profiler (node --prof) or Chrome DevTools to analyze CPU usage and identify hot functions. Monitor event loop lag to detect blocking operations. Implement application performance monitoring (APM) with tools like New Relic, Datadog, or open-source alternatives to track response times, error rates, and throughput in production. Set up alerting for performance degradation before it impacts users. Memory profiling helps detect leaks using heap snapshots and comparison tools.

Code-level optimizations include using asynchronous operations exclusively, avoiding memory leaks by cleaning up event listeners and timers, and streaming large data instead of buffering in memory. Use fast JSON libraries like fast-json-stringify for serialization bottlenecks. Minimize dependencies and keep them updated for performance improvements. Implement gzip or brotli compression for API responses. Consider HTTP/2 for multiplexing and header compression. These techniques combined create Node.js applications that handle high traffic efficiently while maintaining responsiveness and stability under load.`,
      category: node,
      mainPictureUrl:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&h=400&fit=crop",
    },
    {
      title: "Building a GraphQL API with Apollo Server",
      body: `GraphQL provides a more efficient alternative to REST, allowing clients to request exactly the data they need and receive it in a predictable structure. Apollo Server is the most popular GraphQL server implementation for Node.js, providing a production-ready solution with features like schema stitching, data sources, caching, and comprehensive DevTools integration. Unlike REST where you hit multiple endpoints to gather related data, GraphQL exposes a single endpoint where clients describe their data requirements in a query language that mirrors the shape of the response.

Schema design is the foundation of any GraphQL API, defining the types, queries, mutations, and subscriptions available to clients. Use the Schema Definition Language (SDL) to declare types with fields, arguments, and return types. Design your schema based on how clients use data rather than database structure, using types like User, Post, and Comment that make sense from a product perspective. Implement interfaces and unions for polymorphic types, and use enums for fields with a fixed set of values. Good schema design is client-focused and evolves carefully to avoid breaking changes.

Resolvers are functions that fetch the data for each field in your schema. They receive parent data, arguments, context, and information about the query execution. Structure resolvers hierarchically matching your schema, with each resolver responsible for returning data for its field. The parent argument contains data from the parent resolver, enabling nested data fetching. Use DataLoader to batch and deduplicate database queries, solving the N+1 query problem common in GraphQL APIs where nested resolvers trigger multiple database round-trips.

Mutations handle write operations in GraphQL, following similar patterns to queries but conventionally grouped separately in the schema. Design mutations to accept input objects rather than many individual arguments, making them easier to extend without breaking changes. Return the modified resource or a payload type containing both the resource and any errors. Implement proper validation and authorization checks in mutation resolvers before modifying data. Consider using transactions for mutations that affect multiple resources to maintain data consistency.

Context provides a way to share data across all resolvers, typically including the current user, database connections, and data loaders. Initialize context from request headers or cookies to authenticate users and attach user information that resolvers can use for authorization. Keep context lightweight as it's created for every request. Use middleware or plugins to transform context or add lifecycle hooks for logging, metrics, or request transformation.

Subscriptions enable real-time updates through WebSockets, allowing clients to receive data when events occur. Implement pub/sub mechanisms using Redis or similar for scaling subscriptions across multiple server instances. Apollo Server integrates with various pub/sub libraries and transport layers. Error handling in GraphQL differs from REST - partial successes are possible where some fields return data while others error. Use custom error classes and formatError to provide consistent error responses. Add monitoring with Apollo Studio for schema validation, performance metrics, and field-level analytics. These capabilities make Apollo Server a comprehensive solution for building modern, type-safe APIs that evolve gracefully with your product requirements.`,
      category: node,
      mainPictureUrl:
        "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=400&fit=crop",
    },
  ];

  function getRandomDate(start: Date, end: Date): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  const now = new Date();
  const threeYearsAgo = new Date(
    now.getFullYear() - 3,
    now.getMonth(),
    now.getDate(),
  );

  for (const articleData of articles) {
    const article = Article.create(articleData);
    const randomDate = getRandomDate(threeYearsAgo, now);
    article.createdAt = randomDate;
    article.updatedAt = getRandomDate(randomDate, now);
    await article.save();
  }
  await db.destroy();
  console.log("done !");
}

main();

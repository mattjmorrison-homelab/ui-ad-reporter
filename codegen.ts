import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    // Note: deliberately omits the base `typescript` plugin. Combining it with
    // `typescript-operations` in a single output causes both plugins to emit their
    // own declaration of every enum referenced by an operation, producing a TS2300
    // "Duplicate identifier" compile error. `typescript-operations` on its own
    // already emits everything a client needs (operation result/variables types),
    // so it's used alone here with `typescript-react-apollo`.
    'src/graphql/generated.tsx': {
      plugins: ['typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        reactApolloVersion: 3,
        enumsAsTypes: true,
        // The backend serializes DateTime as an ISO 8601 UTC string over the
        // wire (see graph-ad-reporter's schema) -- never parsed into a Date
        // client-side, since the only consumer (timezone.ts) formats the raw
        // string directly.
        scalars: {
          DateTime: 'string',
        },
      },
    },
  },
};

export default config;

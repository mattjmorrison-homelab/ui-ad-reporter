/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ReportAdMutationVariables = Exact<{ [key: string]: never; }>;


export type ReportAdMutation = { reportAd: { id: string, timestamp: string, clientIp: string, resolved: boolean } };

export type UnresolvedReportsQueryVariables = Exact<{ [key: string]: never; }>;


export type UnresolvedReportsQuery = { unresolvedReports: Array<{ id: string, timestamp: string, clientIp: string, resolved: boolean, resolutionNote: string | null }> };


export const ReportAdDocument = gql`
    mutation ReportAd {
  reportAd {
    id
    timestamp
    clientIp
    resolved
  }
}
    `;
export type ReportAdMutationFn = Apollo.MutationFunction<ReportAdMutation, ReportAdMutationVariables>;

/**
 * __useReportAdMutation__
 *
 * To run a mutation, you first call `useReportAdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReportAdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reportAdMutation, { data, loading, error }] = useReportAdMutation({
 *   variables: {
 *   },
 * });
 */
export function useReportAdMutation(baseOptions?: Apollo.MutationHookOptions<ReportAdMutation, ReportAdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReportAdMutation, ReportAdMutationVariables>(ReportAdDocument, options);
      }
export type ReportAdMutationHookResult = ReturnType<typeof useReportAdMutation>;
export type ReportAdMutationResult = Apollo.MutationResult<ReportAdMutation>;
export type ReportAdMutationOptions = Apollo.BaseMutationOptions<ReportAdMutation, ReportAdMutationVariables>;
export const UnresolvedReportsDocument = gql`
    query UnresolvedReports {
  unresolvedReports {
    id
    timestamp
    clientIp
    resolved
    resolutionNote
  }
}
    `;

/**
 * __useUnresolvedReportsQuery__
 *
 * To run a query within a React component, call `useUnresolvedReportsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnresolvedReportsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnresolvedReportsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUnresolvedReportsQuery(baseOptions?: Apollo.QueryHookOptions<UnresolvedReportsQuery, UnresolvedReportsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UnresolvedReportsQuery, UnresolvedReportsQueryVariables>(UnresolvedReportsDocument, options);
      }
export function useUnresolvedReportsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UnresolvedReportsQuery, UnresolvedReportsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UnresolvedReportsQuery, UnresolvedReportsQueryVariables>(UnresolvedReportsDocument, options);
        }
// @ts-ignore
export function useUnresolvedReportsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UnresolvedReportsQuery, UnresolvedReportsQueryVariables>): Apollo.UseSuspenseQueryResult<UnresolvedReportsQuery, UnresolvedReportsQueryVariables>;
export function useUnresolvedReportsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UnresolvedReportsQuery, UnresolvedReportsQueryVariables>): Apollo.UseSuspenseQueryResult<UnresolvedReportsQuery | undefined, UnresolvedReportsQueryVariables>;
export function useUnresolvedReportsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UnresolvedReportsQuery, UnresolvedReportsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UnresolvedReportsQuery, UnresolvedReportsQueryVariables>(UnresolvedReportsDocument, options);
        }
export type UnresolvedReportsQueryHookResult = ReturnType<typeof useUnresolvedReportsQuery>;
export type UnresolvedReportsLazyQueryHookResult = ReturnType<typeof useUnresolvedReportsLazyQuery>;
export type UnresolvedReportsSuspenseQueryHookResult = ReturnType<typeof useUnresolvedReportsSuspenseQuery>;
export type UnresolvedReportsQueryResult = Apollo.QueryResult<UnresolvedReportsQuery, UnresolvedReportsQueryVariables>;
declare module "swr" {
  export interface SWRConfiguration<Data = any, Error = any> {
    dedupingInterval?: number
    revalidateOnFocus?: boolean
  }

  export interface SWRResponse<Data = any, Error = any> {
    data?: Data
    error?: Error
    isLoading: boolean
  }

  export default function useSWR<Data = any, Error = any>(
    key: string | null,
    fetcher: ((...args: any[]) => Promise<Data>) | null,
    config?: SWRConfiguration<Data, Error>
  ): SWRResponse<Data, Error>
} 
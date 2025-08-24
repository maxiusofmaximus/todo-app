'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { performanceUtils } from '@/lib/utils'

// Hook para debouncing
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook para throttling
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledCallback = useMemo(
    () => performanceUtils.throttle(callback, delay),
    [callback, delay]
  )

  return throttledCallback as T
}

// Hook para memoización con cache personalizado
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps)
}

// Hook para lazy loading de datos
export function useLazyData<T>(
  fetchFn: () => Promise<T>,
  condition: boolean = true
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const hasFetched = useRef(false)

  const fetchData = useCallback(async () => {
    if (!condition || hasFetched.current) return

    setLoading(true)
    setError(null)
    hasFetched.current = true

    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, condition])

  useEffect(() => {
    if (condition && !hasFetched.current) {
      fetchData()
    }
  }, [condition, fetchData])

  const refetch = useCallback(() => {
    hasFetched.current = false
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

// Hook para intersection observer (lazy loading de componentes)
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [hasIntersected, options])

  return { elementRef, isIntersecting, hasIntersected }
}

// Hook para medir performance de renders
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0)
  const lastRenderTime = useRef(0)

  useEffect(() => {
    renderCount.current += 1
    const now = performance.now()
    
    if (process.env.NODE_ENV === 'development') {
      if (lastRenderTime.current > 0) {
        const timeSinceLastRender = now - lastRenderTime.current
        console.log(
          `${componentName} render #${renderCount.current} - Time since last render: ${timeSinceLastRender.toFixed(2)}ms`
        )
      }
    }
    
    lastRenderTime.current = now
  })

  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current
  }
}

// Hook para cache con TTL
export function useCacheWithTTL<T>(key: string, ttl: number = 5 * 60 * 1000) {
  const cache = useRef(new Map<string, { data: T; timestamp: number }>())

  const get = useCallback((cacheKey: string): T | null => {
    const cached = cache.current.get(cacheKey)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > ttl) {
      cache.current.delete(cacheKey)
      return null
    }

    return cached.data
  }, [ttl])

  const set = useCallback((cacheKey: string, data: T) => {
    cache.current.set(cacheKey, {
      data,
      timestamp: Date.now()
    })
  }, [])

  const clear = useCallback(() => {
    cache.current.clear()
  }, [])

  const remove = useCallback((cacheKey: string) => {
    cache.current.delete(cacheKey)
  }, [])

  return { get, set, clear, remove }
}

// Hook para optimizar listas grandes con virtualización
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    }
  }, [items, itemHeight, containerHeight, scrollTop])

  const handleScroll = useThrottle((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, 16) // 60fps

  return {
    visibleItems,
    handleScroll,
    totalHeight: visibleItems.totalHeight
  }
}

export default {
  useDebounce,
  useThrottle,
  useMemoizedCallback,
  useLazyData,
  useIntersectionObserver,
  useRenderPerformance,
  useCacheWithTTL,
  useVirtualList
}
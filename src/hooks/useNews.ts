import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { fetchNewsApi } from '@/src/services/newsApi'
import type { NewsArticle } from '@/src/types/news'

export type NewsStatus = 'loading' | 'ready' | 'error' | 'coldStart'

export function useNews() {
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null)
    const [status, setStatus] = useState<NewsStatus>('loading')

    const loadNews = useCallback(() => {
        setStatus('loading')
        let active = true

        fetchNewsApi()
            .then(data => {
                if (!active) return
                setArticles(data)
                if (data.length > 0) {
                    setActiveArticle(data[0])
                } else {
                    setActiveArticle(null)
                }
                setStatus('ready')
            })
            .catch(err => {
                if (!active) return
                console.error('Error fetching news in useNews hook:', err)
                if (axios.isAxiosError(err) && err.response?.status === 503) {
                    setStatus('coldStart')
                } else {
                    setStatus('error')
                }
            })

        return () => {
            active = false
        }
    }, [])

    useEffect(() => {
        const cleanup = loadNews()
        return cleanup
    }, [loadNews])

    return {
        articles,
        activeArticle,
        setActiveArticle,
        status,
        retry: loadNews
    }
}

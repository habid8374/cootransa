import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { aboutPages } from '../content/about'
import PageLayout from '../components/PageLayout'
import NotFound from './NotFound'

export default function AboutPage() {
  const { slug } = useParams()
  const page = aboutPages.find(p => p.slug === slug)
  useEffect(() => { window.scrollTo(0, 0); if (page) document.title = `${page.title} – COOTRANSA` }, [page])
  if (!page) return <NotFound />
  return <PageLayout page={page} />
}

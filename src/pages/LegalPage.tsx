import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { legalPages } from '../content/legal'
import PageLayout from '../components/PageLayout'
import NotFound from './NotFound'

export default function LegalPage() {
  const { slug } = useParams()
  const page = legalPages.find(p => p.slug === slug)
  useEffect(() => { window.scrollTo(0, 0); if (page) document.title = `${page.title} – COOTRANSA` }, [page])
  if (!page) return <NotFound />
  return <PageLayout page={page} />
}

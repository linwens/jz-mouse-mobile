import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue mouse H5'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

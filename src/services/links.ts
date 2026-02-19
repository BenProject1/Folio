import { supabase } from '../lib/supabase'
import type { FolioLink } from '../lib/supabase'

export async function getLinks(userId: string): Promise<FolioLink[]> {
  const { data } = await supabase
    .from('folio_links')
    .select('*')
    .eq('user_id', userId)
    .order('position')
  return (data ?? []) as FolioLink[]
}

export async function addLink(userId: string, link: Partial<FolioLink>): Promise<FolioLink | null> {
  const { data: existing } = await supabase.from('folio_links').select('position').eq('user_id', userId).order('position', { ascending: false }).limit(1)
  const position = existing?.[0]?.position !== undefined ? existing[0].position + 1 : 0
  const { data } = await supabase.from('folio_links').insert({ ...link, user_id: userId, position }).select().single()
  return data as FolioLink | null
}

export async function updateLink(id: string, updates: Partial<FolioLink>): Promise<void> {
  await supabase.from('folio_links').update(updates).eq('id', id)
}

export async function deleteLink(id: string): Promise<void> {
  await supabase.from('folio_links').delete().eq('id', id)
}

export async function reorderLinks(links: { id: string; position: number }[]): Promise<void> {
  await Promise.all(links.map(({ id, position }) => supabase.from('folio_links').update({ position }).eq('id', id)))
}

export async function recordLinkClick(linkId: string, profileId: string): Promise<void> {
  await Promise.all([
    supabase.from('folio_link_clicks').insert({ link_id: linkId, profile_id: profileId, device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop' }),
    supabase.rpc('increment_link_clicks', { link_id_param: linkId })
  ])
}

export async function recordPageView(profileId: string): Promise<void> {
  await supabase.from('folio_page_views').insert({
    profile_id: profileId,
    device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    referrer: document.referrer || 'direct'
  })
}

export async function getAnalytics(userId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const [views, clicks, links] = await Promise.all([
    supabase.from('folio_page_views').select('viewed_at, device').eq('profile_id', userId).gte('viewed_at', thirtyDaysAgo),
    supabase.from('folio_link_clicks').select('clicked_at, link_id').eq('profile_id', userId).gte('clicked_at', thirtyDaysAgo),
    supabase.from('folio_links').select('id, title, click_count').eq('user_id', userId).order('click_count', { ascending: false }).limit(5)
  ])
  return { views: views.data ?? [], clicks: clicks.data ?? [], topLinks: links.data ?? [] }
}

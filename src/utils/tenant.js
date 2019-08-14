import Cookies from 'js-cookie'
import { settingTenant } from '@/api/tenant'

const TenantKey = 'tenantId'

export function getTenant() {
  return Cookies.get(TenantKey)
}

export function setTenant(id) {
  settingTenant(id).then(response => {})
  return Cookies.set(TenantKey, id)
}

export function removeTenant() {
  return Cookies.remove(TenantKey)
}

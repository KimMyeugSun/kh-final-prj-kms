const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

async function refreshToken() {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) return null;

  const res = await fetch(`${API_BASE}/api/public/refresh`, {
    method: 'POST',
    headers: { RefreshToken: refreshToken},
  });
  
  if (!res.ok) return null;
  const newAccessToken = res.headers.get('Authorization').replace('Bearer ', '');
  const newRefreshToken = res.headers.get('RefreshToken');
  
  if (newRefreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
  }
  
  if (newAccessToken) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    return newAccessToken;
  }
  return null;
}

export default async function authFetch(url, options = {}) {
  const _url_ = url.startsWith('http') ? url : `${API_BASE}/${url.replace(/^\//, '')}`;
  console.log(_url_);
  
  let token = getAccessToken();
  let headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  let response = await fetch(_url_, { ...options, headers });

  if (response.status === 401) {
    // 토큰 만료 시 refresh 시도
    const newToken = await refreshToken();
    if (newToken) {
      headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
      };
      // await new Promise(r => setTimeout(r, 100));
      response = await fetch(_url_, { ...options, headers });
    }
  }

  return response;
}
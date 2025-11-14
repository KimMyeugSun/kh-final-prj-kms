import { createContext, useState } from 'react';
import authFetch, { getAccessToken } from '../utils/authFetch';
import { useNavigate } from 'react-router-dom';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_INFO_KEY = 'userInfo';
const REFRESH_TOKEN_KEY = 'refreshToken';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE}` || 'http://localhost:8080';

export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [rawUser, setRawUser] = useState(getUser() || null); //!< 사용자 정보
  const [accessToken, setAccessToken] = useState(getAccessToken() || null); //!< 액세스 토큰
  // const [refreshToken, setRefreshToken] = useState(getRefreshToken() || null); //!< 리프레시 토큰
  
  const signIn = async (id, password) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password }),
      });

      if (!response.ok) {
        const errjson = await response.json();
        throw new Error(errjson.errorMsg || '로그인에 실패했습니다.');
      }
        
      const token = response.headers.get('Authorization');
      const refreshToken = response.headers.get('RefreshToken');

      if (refreshToken) {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }

      if (token) {
        setAccessToken(token);
        setToken(token);

        //!< 토큰 발급 후 /pull 요청
        const pullRes = await authFetch(`${API_BASE_URL}/pull`);
        if (pullRes.ok) {
          const jsondata = await pullRes.json();
          const pullData = jsondata?.data;
          if (!pullData) throw new Error('사용자 정보가 없습니다.');
          
          sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(pullData));
          setRawUser(pullData);
        } else {
          const faildjson = await pullRes.json();
          throw new Error(faildjson.errorMsg || '사용자 정보 조회에 실패했습니다.');
        }
      } else {
        throw new Error('토큰이 응답에 없습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
    }
  };

  const signOut = (location) => {
    const currentPath = location.pathname;
    if(currentPath.includes('/management'))
      navigate('/management');
    else
      navigate('/');

    setUser(null);
    setAccessToken(null);
    
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(USER_INFO_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  function setUser(userInfo) {
    sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    setRawUser(userInfo);
  }

  function getUser() {
    return JSON.parse(sessionStorage.hasOwnProperty(USER_INFO_KEY) ? sessionStorage.getItem(USER_INFO_KEY) : null);
  }

  function getEmpNo() {
    const userInfo = getUser();
    return userInfo?.employee?.empNo ?? null;
  }

  function getProfile() {
    const userInfo = getUser();
    return userInfo?.employee?.empProfileName ?? null;
  }

  function getRoles() {
    const userInfo = getUser();
    return userInfo?.employee?.roles ?? null;
  }

  function getTag() {
    const userInfo = getUser();
    return userInfo?.employee?.tags ?? null;
  }

  function getName() {
    const userInfo = getUser();
    return userInfo?.name ?? null;
  }

  function getPhone(){
    const userInfo = getUser();
    return userInfo?.employee?.empPhone ?? null;
  }

  function getEmail(){
    const userInfo = getUser();
    return userInfo?.employee?.empEmail ?? null;
  }

  function getAddress(){
    const userInfo = getUser();
    return userInfo?.employee?.empAddress ?? null;
  }

  function getAddressDetail(){
    const userInfo = getUser();
    return userInfo?.employee?.empAddressDetail ?? null;
  }

  function isAuthenticated() {
    const token = getAccessToken();
    if (!token) return false;

    return true;
  }

  function hasAccessToManagement() {
    if (!isAuthenticated()) return false;
    const roles = getRoles();
    return roles.includes('ADMIN') || roles.includes('MANAGER');
  }

  function hasAccessToUserPages() {
    if (!isAuthenticated()) return false;
    const roles = getRoles();
    return (
      roles.includes('ADMIN') ||
      roles.includes('MANAGER') ||
      roles.includes('USER')
    );
  }

  function hasRole(role) {
    const roles = getRoles();
    if (!roles) return false;
    return roles.includes(role);
  }

  function setToken(token) {
    const touchedToken = token.replace('Bearer ', '');
    sessionStorage.setItem(ACCESS_TOKEN_KEY, touchedToken);
  }

  return (
    <AuthContext.Provider
      value={{
        rawUser,
        getUser,
        setUser,
        getEmpNo,
        getProfile,
        getRoles,
        getName,
        getTag,
        getPhone,
        getEmail,
        getAddress,
        getAddressDetail,
        isAuthenticated,
        hasAccessToManagement,
        hasAccessToUserPages,
        hasRole,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { addNotification, clearNotifications } from '../redux/notificationSlice';
import { useAuth } from '../auth/useAuth';

export const WEBSOCKET_BASE = (import.meta.env.VITE_WEBSOCKET_BASE || '').replace(/\/$/, '');

const NotificationContext = createContext();
export function useNotification() {
  return useContext(NotificationContext);
}

export default function NotificationManager({ children }) {
  const dispatch = useDispatch();
  const clientRef = useRef(null);
  const subsRef = useRef([]);
  const { rawUser, getEmpNo, setUser } = useAuth();
  const processedMsgs = useRef(new Set());

  useEffect(() => {
    if (!rawUser) return;
    console.log('NotificationManager mount', !!clientRef.current);

    if (clientRef.current && clientRef.current.active) {
      console.warn('Notification client already active - skip create');
      return;
    }

    // 프로토콜 보정: 페이지가 https이면 wss로 교체
    let base = WEBSOCKET_BASE;
    if (location && location.protocol === 'https:' && base.startsWith('ws://')) {
      base = base.replace(/^ws:\/\//i, 'wss://');
    }

    const client = new Client({
      brokerURL: `${base}/notification`,
      reconnectDelay: 5000,
      connectHeaders: { eno: getEmpNo() },
    });

    client.onConnect = () => {
      dispatch(clearNotifications());

      try {
        const sub1 = client.subscribe(`/sub/notification/${getEmpNo()}`, (packet) => {
          try {
            // 원시 body 로그로 중복 원인 확인
            const payload = JSON.parse(packet.body);
            // 메시지 고유 id가 있으면 사용, 없으면 body 해시 사용
            const msgId = payload?.id || JSON.stringify(payload);
            if (processedMsgs.current.has(msgId)) {
              return;
            }
            processedMsgs.current.add(msgId);
            dispatch(addNotification(payload));
          } catch (e) { console.error(e); }
        });
        const sub2 = client.subscribe(`/sub/welfare-point/${getEmpNo()}`, (packet) => {
          try {
            const body = JSON.parse(packet.body);
            const welfarePoints = { ...rawUser, employee: { ...rawUser.employee, empWelfarePoints: body?.welfarePoints } };
            if (typeof setUser === 'function') setUser(welfarePoints);
          } catch (e) { console.error('welfare-point parse error', e); }
        });
        subsRef.current = [sub1, sub2];
      } catch (err) {
        console.error('subscribe error', err);
      }

      // 안전하게 client.publish 사용 (clientRef may be set already)
      try {
        client.publish({
          destination: '/pub/unprocessed',
          body: JSON.stringify({ eno: rawUser?.employee?.empNo }),
        });
      } catch (e) { console.error('publish error', e); }
    };

    clientRef.current = client;
    client.activate();

    return () => {
      // cleanup
      subsRef.current.forEach(s => s?.unsubscribe?.());
      clientRef.current?.deactivate?.();
      clientRef.current = null;
      processedMsgs.current.clear();
    };
  }, [rawUser, getEmpNo]);

  const sendNotification = (destination, packet) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(packet),
      });
    }
  };

  return (
    <NotificationContext.Provider value={{ sendNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

import { Injectable, signal, inject } from '@angular/core';
import { Message } from '../models/message.model';
import { ApiService } from './api.service';

import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  connected = signal(false);
  private bc?: BroadcastChannel;
  private storageKey = 'street_messages';
  private api = inject(ApiService);
  private socket?: Socket;

  private joinedRooms: Set<string> = new Set();

  constructor() {
    try {
      this.bc = new BroadcastChannel('street_chat');
      this.bc.onmessage = (ev) => this.onChannelMessage(ev.data);
    } catch (e) {
      // BroadcastChannel not available
    }

    // Do not auto-connect here. Connection attempts are done lazily via connect().
  }

  private canConnectTo(url: string) {
    if (!url) return false;
    try {
      const pageProto = typeof window !== 'undefined' ? window.location.protocol : 'http:';
      const pageHost = typeof window !== 'undefined' ? window.location.hostname : '';
      const urlProto = url.startsWith('https://') ? 'https:' : (url.startsWith('http://') ? 'http:' : pageProto);
      // Allow connection when same protocol, or when running on localhost (dev)
      if (pageHost === 'localhost' || pageHost === '127.0.0.1') return true;
      return pageProto === urlProto;
    } catch (e) { return false; }
  }

  private initSocket(url: string) {
    if (!this.canConnectTo(url)) return;
    if (this.socket) return;
    try {
      this.socket = io(url, { transports: ['websocket'], path: '/socket.io', autoConnect: true });
      this.socket.on('connect', () => { this.connected.set(true);
        this.joinedRooms.forEach(r => this.socket?.emit('join', r));
      });
      this.socket.on('disconnect', () => { this.connected.set(false); });
      this.socket.on('message', (data: any) => this.onChannelMessage(data));
    } catch (e) {
      this.socket = undefined;
    }
  }

  private ensureConnected() {
    const url = this.api.getSafeBaseUrl();
    if (!url) return;
    this.initSocket(url);
  }

  private onChannelMessage(data: any) {
    // store message in localStorage
    const list = this.loadAll();
    list.push(data as Message);
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  joinRoom(room: string){
    if (!room) return;
    this.joinedRooms.add(room);
    this.ensureConnected();
    if (this.socket && this.socket.connected) this.socket.emit('join', room);
  }

  async send(message: Message) {
    // store locally
    const list = this.loadAll();
    list.push(message);
    localStorage.setItem(this.storageKey, JSON.stringify(list));
    // broadcast
    if (this.bc) this.bc.postMessage(message);

    // ensure socket connection attempt
    this.ensureConnected();

    // emit to socket if connected
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', message);
    }

    void message;
  }

  load(conversationId: string): Message[] {
    return this.loadAll().filter(m => m.conversationId === conversationId).sort((a,b)=> new Date(a.createdAt||'').getTime() - new Date(b.createdAt||'').getTime());
  }

  private loadAll(): Message[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
}

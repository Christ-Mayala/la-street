import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../../core/services/socket.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { ChatBoxComponent } from '../../../shared/components/chat-box/chat-box';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, ChatBoxComponent],
  template: `
    <section class="container py-8">
      <h1 class="text-2xl font-bold">Messagerie</h1>
      <p class="mt-2 text-slate-300">Vos conversations récentes.</p>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="col-span-1">
          <div *ngIf="conversations.length===0" class="text-sm text-slate-300">Aucune conversation.</div>
          <ul>
            <li *ngFor="let c of conversations" class="p-3 border border-slate-800 rounded mb-2 flex items-center justify-between">
              <div>
                <div class="font-medium">{{ c.peerName || c.peerId }}</div>
                <div class="text-xs text-slate-400">{{ c.lastMessage?.content }}</div>
              </div>
              <div class="flex flex-col gap-2">
                <button class="btn-outline" (click)="openConversation(c)">Ouvrir</button>
                <button class="btn-outline" (click)="deleteConversation(c)">Supprimer</button>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-span-2">
          <div *ngIf="activeConversation; else empty">
            <h3 class="font-semibold">Conversation avec {{ activeConversation.peerName || activeConversation.peerId }}</h3>
            <app-chat-box [conversationId]="activeConversation.id" [peerId]="activeConversation.peerId"></app-chat-box>
          </div>
          <ng-template #empty>
            <div class="text-sm text-slate-300">Sélectionnez une conversation pour commencer.</div>
          </ng-template>
        </div>
      </div>
    </section>
  `
})
export class MessagesPage {
  private readonly socket = inject(SocketService);
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  conversations: any[] = [];
  activeConversation: any = null;

  constructor(){
    this.loadConversations();
  }

  loadConversations(){
    const messages = JSON.parse(localStorage.getItem('street_messages') || '[]');
    const groups: Record<string, any[]> = {};
    messages.forEach((m:any)=>{
      const id = m.conversationId;
      groups[id] = groups[id] || [];
      groups[id].push(m);
    });
    this.conversations = Object.keys(groups).map(id=>({ id, peerId: id.split('::')[1], lastMessage: groups[id].slice(-1)[0], peerName: null }));
  }

  openConversation(c:any){
    this.activeConversation = { id: c.id, peerId: c.peerId, peerName: c.peerName };
  }

  deleteConversation(c:any){
    // remove all messages for conversation locally
    const messages = JSON.parse(localStorage.getItem('street_messages') || '[]');
    const remaining = messages.filter((m:any)=>m.conversationId !== c.id);
    localStorage.setItem('street_messages', JSON.stringify(remaining));
    
    this.loadConversations();
    if (this.activeConversation && this.activeConversation.id === c.id) this.activeConversation = null;
  }
}

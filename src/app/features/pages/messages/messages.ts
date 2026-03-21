import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../../core/services/socket.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { ChatBoxComponent } from '../../../shared/components/chat-box/chat-box';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatBoxComponent],
  template: `
    <div class="min-h-[calc(100vh-64px)] relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Background elements -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden pointer-events-none">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 h-full flex flex-col">
        <div class="container py-6 md:py-8 flex-1 flex flex-col">
          <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 flex-1 flex flex-col md:flex-row overflow-hidden shadow-2xl shadow-black/50">
            <!-- Sidebar -->
            <div class="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-black/20">
              <div class="p-4 border-b border-slate-800 bg-black/20">
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                  </svg>
                  Messages
                </h2>
              </div>
              <div class="flex-1 overflow-y-auto no-scrollbar">
                <div *ngIf="conversations.length === 0" class="p-8 text-center text-slate-500">
                  <p>Aucune discussion</p>
                </div>
                <!-- ... list rooms ... -->
                <div *ngFor="let c of conversations" (click)="openConversation(c)"
                  class="p-4 border-b border-slate-800/50 cursor-pointer hover:bg-yellow-400/5 transition-colors"
                  [class.bg-yellow-400/10]="activeConversation?.id === c.id">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex-shrink-0 flex items-center justify-center text-white font-bold">
                      {{ (c.peerName?.[0] || '?') | uppercase }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-white truncate">{{ c.peerName || c.peerId }}</h4>
                      <p class="text-sm text-slate-400 truncate">{{ c.lastMessage?.content || 'Nouvelle discussion' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat area -->
            <div class="flex-1 flex flex-col min-h-[400px]">
              <ng-container *ngIf="activeConversation; else noSelected">
                <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-black/20">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold">
                      {{ (activeConversation.peerName?.[0] || '?') | uppercase }}
                    </div>
                    <h3 class="font-bold text-white">{{ activeConversation.peerName || activeConversation.peerId }}</h3>
                  </div>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-black/10">
                  <!-- messages -->
                  <app-chat-box [conversationId]="activeConversation.id" [peerId]="activeConversation.peerId"></app-chat-box>
                </div>
                <div class="p-4 border-t border-slate-800 bg-black/20">
                  <form (ngSubmit)="send()" class="flex gap-2">
                    <input [(ngModel)]="content" name="content" type="text" placeholder="Écrivez votre message..."
                      class="flex-1 bg-black/40 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all">
                    <button type="submit" class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold p-2.5 rounded-xl transition-all shadow-lg shadow-yellow-500/20">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </button>
                  </form>
                </div>
              </ng-container>
              <ng-template #noSelected>
                <div class="flex-1 flex items-center justify-center text-slate-500 p-8 text-center">
                  <div class="max-w-xs">
                    <svg class="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <p class="text-lg">Sélectionnez une discussion pour commencer à discuter</p>
                  </div>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MessagesPage {
  private readonly socket = inject(SocketService);
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  conversations: any[] = [];
  activeConversation: any = null;
  content = '';

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

  async send(){
    if (!this.content.trim() || !this.activeConversation) return;
    
    const msg = {
      content: this.content,
      conversationId: this.activeConversation.id,
      receiverId: this.activeConversation.peerId,
      senderId: this.auth.user()?._id,
      timestamp: new Date().toISOString()
    };

    // This is a mockup of sending, since ChatBox handles actual socket emission
    // But we need the method for the form
    this.content = '';
  }
}

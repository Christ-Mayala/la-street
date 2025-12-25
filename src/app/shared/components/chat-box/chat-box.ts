import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../../core/services/socket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Message } from '../../../core/models/message.model';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="border border-slate-800 rounded-lg p-3 bg-black/40">
      <div class="h-56 overflow-y-auto mb-3" #panel>
        <div *ngFor="let m of messages" class="mb-2">
          <div [class]="m.from === meId ? 'text-right' : 'text-left'">
            <div class="inline-block p-2 rounded-md border border-slate-800" [ngClass]="m.from === meId ? 'bg-primary text-black' : 'bg-slate-950/60 text-slate-100'">{{ m.content }}</div>
            <div class="text-xs text-slate-400">{{ m.createdAt | date:'shortTime' }}</div>
          </div>
        </div>
      </div>
      <form class="flex gap-2" (ngSubmit)="send()">
        <input [(ngModel)]="text" name="text" class="flex-1 input-modern" placeholder="Écrire un message..." />
        <button class="btn-primary" type="submit">Envoyer</button>
      </form>
    </div>
  `
})
export class ChatBoxComponent {
  @Input() conversationId = '';
  @Input() peerId = '';

  private readonly socket = inject(SocketService);
  private readonly auth = inject(AuthService);
  messages: Message[] = [];
  text = '';
  meId = '';

  ngOnInit() {
    const u = this.auth.user();
    this.meId = u ? u._id || u.email : 'guest';
    this.messages = this.socket.load(this.conversationId);
    // join socket room for real-time messages
    try { this.socket.joinRoom(this.conversationId); } catch (e) {}
    // Listen for storage changes (simple polling) - BroadcastChannel will sync across tabs
    window.addEventListener('storage', () => (this.messages = this.socket.load(this.conversationId)));
  }

  send() {
    if (!this.text.trim()) return;
    const msg: Message = {
      conversationId: this.conversationId,
      from: this.meId,
      to: this.peerId,
      content: this.text.trim(),
      createdAt: new Date().toISOString(),
    };
    this.socket.send(msg);
    this.messages.push(msg);
    this.text = '';
  }
}

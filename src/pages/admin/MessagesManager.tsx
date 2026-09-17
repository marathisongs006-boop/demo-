import React, { useState, useEffect } from 'react';
import { ContactMessage } from '../../types';
import { getContactMessages, updateMessageStatus, deleteContactMessage } from '../../firebase/services';
import {
  Inbox,
  Mail,
  Trash2,
  Calendar,
  Reply,
  Loader2
} from 'lucide-react';

export const MessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessagesList = async () => {
    try {
      const res = await getContactMessages();
      setMessages(res);
    } catch (err) {
      console.error('Failed to load messages from Firestore:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagesList();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      await updateMessageStatus(id, newStatus);
      setMessages(messages.map(m => (m.id === id ? { ...m, status: newStatus } : m)));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update message status in Firestore.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this message from Firestore?')) return;
    try {
      await deleteContactMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete message from Firestore.');
    }
  };

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(m => m.status === filter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Messages & Inquiries Inbox (Firestore)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View submissions from visitors and clients saved directly in Cloud Firestore.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'unread' ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'read' ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'replied' ? 'bg-brand-500 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Replied
          </button>
        </div>
      </div>

      {/* Main Inbox View: Split List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Messages List Column */}
        <div className="lg:col-span-5 space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                setSelectedMessage(msg);
                if (msg.status === 'unread') {
                  handleUpdateStatus(msg.id, 'read');
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedMessage?.id === msg.id
                  ? 'bg-brand-50/50 dark:bg-brand-950/30 border-brand-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {msg.name}
                </span>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                {msg.subject || 'Portfolio Inquiry'}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {msg.message}
              </p>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  msg.status === 'unread'
                    ? 'bg-brand-500 text-white'
                    : msg.status === 'replied'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {msg.status.toUpperCase()}
                </span>

                <span className="text-[10px] text-slate-400">{msg.email}</span>
              </div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No messages found in this view.
            </div>
          )}
        </div>

        {/* Message Detail View Column */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-500 font-bold">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedMessage.name}
                    </h2>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-xs text-brand-500 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Subject
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedMessage.subject || 'Portfolio Inquiry'}
                </h3>
                <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Received {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Message Content
                </span>
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Mark Status:</span>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'unread')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      selectedMessage.status === 'unread'
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      selectedMessage.status === 'read'
                        ? 'bg-slate-800 text-white dark:bg-slate-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Read
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      selectedMessage.status === 'replied'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Replied
                  </button>
                </div>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all"
                >
                  <Reply className="w-3.5 h-3.5" />
                  Reply via Email Client
                </a>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-center">
              <Inbox className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-700" />
              <div className="font-bold text-sm text-slate-600 dark:text-slate-400">Select a message to view details</div>
              <div className="text-xs text-slate-400 mt-1">Read visitor inquiries stored in Firestore</div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

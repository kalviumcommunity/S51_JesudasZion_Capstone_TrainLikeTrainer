'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Bot,
  Loader2,
  RotateCcw,
  Copy,
  Check,
  ArrowUp,
  Zap,
  Target,
  Activity,
  ShieldCheck
} from 'lucide-react';
import {
  PixelFlame,
  PixelSoccerBall,
  PixelTrophy
} from '@/components/PixelSportsAnimations';

export default function AiCoachPage() {
  const { status: sessionStatus } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [sports, setSports] = useState([]);

  // Coach continuity: the active thread, the athlete's past threads, and the
  // short list of facts they've asked the coach to remember.
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [memory, setMemory] = useState([]);
  const [newFact, setNewFact] = useState('');
  const [memoryError, setMemoryError] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const isSignedIn = sessionStatus === 'authenticated';

  async function refreshConversations() {
    try {
      const res = await fetch('/api/ai/conversations');
      const data = await res.json();
      if (res.ok) setConversations(data.conversations || []);
    } catch (err) {
      console.error('Could not load conversations:', err);
    }
  }

  async function refreshMemory() {
    try {
      const res = await fetch('/api/ai/memory');
      const data = await res.json();
      if (res.ok) setMemory(data.memory || []);
    } catch (err) {
      console.error('Could not load coach memory:', err);
    }
  }

  useEffect(() => {
    if (!isSignedIn) {
      setConversations([]);
      setMemory([]);
      return;
    }
    refreshConversations();
    refreshMemory();
  }, [isSignedIn]);

  async function openConversation(id) {
    try {
      const res = await fetch(`/api/ai/conversations/${id}`);
      const data = await res.json();
      if (!res.ok) return;

      setConversationId(id);
      setSelectedSport(data.conversation.sport || 'All');
      setMessages(
        (data.conversation.messages || []).map((m, i) => ({
          id: `${id}-${i}`,
          role: m.role,
          content: m.content,
          isFallback: m.isFallback,
          timestamp: m.createdAt
            ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
        }))
      );
      setPanelOpen(false);
    } catch (err) {
      console.error('Could not open conversation:', err);
    }
  }

  async function deleteConversation(id) {
    try {
      const res = await fetch(`/api/ai/conversations/${id}`, { method: 'DELETE' });
      if (!res.ok) return;
      if (id === conversationId) {
        setConversationId(null);
        setMessages([]);
      }
      refreshConversations();
    } catch (err) {
      console.error('Could not delete conversation:', err);
    }
  }

  async function addFact(e) {
    e.preventDefault();
    const fact = newFact.trim();
    if (!fact) return;

    setMemoryError(null);
    try {
      const res = await fetch('/api/ai/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fact }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMemoryError(data.error || 'Could not save that.');
        return;
      }
      setMemory(data.memory || []);
      setNewFact('');
    } catch {
      setMemoryError('Network error — nothing was saved.');
    }
  }

  async function forgetFact(fact) {
    try {
      const res = await fetch('/api/ai/memory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fact }),
      });
      const data = await res.json();
      if (res.ok) setMemory(data.memory || []);
    } catch (err) {
      console.error('Could not remove fact:', err);
    }
  }

  // The sport dropdown used to read the static data/sports.js file, so it could
  // offer sports the library no longer has (or miss ones it gained).
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/sports');
        const data = await res.json();
        if (res.ok) setSports(data.sports || []);
      } catch (err) {
        console.error('Could not load sports:', err);
      }
    })();
  }, []);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Follow the conversation as it grows — but only once there is a
  // conversation. This used to fire on mount with an empty thread, which
  // scrolled the whole page to the bottom the moment you opened the page.
  useEffect(() => {
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  const handleTextareaInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  // Quick suggestion prompts
  const suggestionCards = [
    {
      title: 'Warmup Protocol',
      prompt: 'Create a 20-minute explosive dynamic warmup for matchday',
      icon: Zap,
      sport: 'Football'
    },
    {
      title: 'Vertical Jump',
      prompt: 'What are the best plyometric drills to increase my vertical jump by 3 inches?',
      icon: Target,
      sport: 'Basketball'
    },
    {
      title: 'Recovery Plan',
      prompt: 'Provide a post-game muscle recovery and nutrition protocol',
      icon: Activity,
      sport: 'Fitness'
    },
    {
      title: 'Match Tactics',
      prompt: 'How do I handle high-pressing opponents when playing out from the back?',
      icon: ShieldCheck,
      sport: 'Tactics'
    }
  ];

  const handleSend = async (customPrompt) => {
    const query = customPrompt || input;
    if (!query.trim() || isLoading) return;

    const userMsgId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: query, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);

    if (!customPrompt) {
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, sport: selectedSport, conversationId }),
      });
      const data = await res.json();

      // The server owns the thread id; it creates one on the first message.
      if (data.conversationId && data.conversationId !== conversationId) {
        setConversationId(data.conversationId);
      }
      if (data.conversationId) refreshConversations();

      // The coach may have just learned something about the athlete. Refresh
      // the panel and note it on the message so it is never silent.
      if (data.learned?.length) {
        refreshMemory();
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: data.response || 'Apologies, I could not process your prompt at this moment.',
          // Flagged so a generic template is never presented as a personalised
          // AI answer.
          isFallback: Boolean(data.fallback),
          fallbackReason: data.reason,
          learned: data.learned || [],
          sourcePrompt: query,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: 'Connection issue. Please check your network and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setConversationId(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  // Render assistant markdown content nicely
  const renderFormattedContent = (content) => {
    const lines = content.split('\n');
    const blocks = [];
    let list = null; // { ordered, items: [] }

    const flushList = () => {
      if (!list) return;
      const ListTag = list.ordered ? 'ol' : 'ul';
      blocks.push(
        <ListTag
          key={`list-${blocks.length}`}
          className={`my-2 ml-5 space-y-1 ${list.ordered ? 'list-decimal' : 'list-disc'}`}
        >
          {list.items.map((item, i) => (
            <li key={i} className="text-[#A89C8D] leading-relaxed pl-1">
              {formatInline(item)}
            </li>
          ))}
        </ListTag>
      );
      list = null;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Bullets and numbered steps are collected so they land inside a real
      // <ul>/<ol> instead of loose <li> elements.
      const bullet = trimmed.match(/^[*-]\s+(.*)$/);
      const numbered = trimmed.match(/^\d+[.)]\s+(.*)$/);

      if (bullet || numbered) {
        const ordered = Boolean(numbered);
        if (!list || list.ordered !== ordered) {
          flushList();
          list = { ordered, items: [] };
        }
        list.items.push((bullet || numbered)[1]);
        return;
      }

      flushList();

      // Headings. These used to insert the raw line, so a heading written as
      // "### **3. Cool-Down**" rendered its asterisks literally.
      const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        const level = heading[1].length;
        const text = heading[2];
        const Tag = level <= 2 ? 'h3' : 'h4';
        return blocks.push(
          <Tag
            key={idx}
            className={`text-white font-semibold tracking-tight ${
              level <= 2 ? 'text-lg mt-5 mb-2' : 'text-base mt-4 mb-2'
            }`}
          >
            {formatInline(text)}
          </Tag>
        );
      }

      if (/^(---+|\*\*\*+|___+)$/.test(trimmed)) {
        return blocks.push(<hr key={idx} className="border-[#2B2723] my-4" />);
      }

      if (trimmed === '') {
        return blocks.push(<div key={idx} className="h-2" />);
      }

      // A line that is entirely bold is how models often write a heading
      // without using #, so treat it as one.
      const boldOnly = trimmed.match(/^\*\*(.+)\*\*:?$/);
      if (boldOnly) {
        return blocks.push(
          <h4 key={idx} className="text-white font-semibold text-base mt-4 mb-2 tracking-tight">
            {formatInline(boldOnly[1])}
          </h4>
        );
      }

      blocks.push(
        <p key={idx} className="text-[#A89C8D] leading-relaxed my-1">
          {formatInline(line)}
        </p>
      );
    });

    flushList();
    return blocks;
  };

  /**
   * Turns inline markdown into elements. Handles **bold**, *italic*, _italic_
   * and `code` in a single pass — the previous version only understood **bold**,
   * so italics rendered with their asterisks showing.
   */
  const formatInline = (text) => {
    if (!text) return null;

    // Bold is listed first so ** is consumed before a single * can match it.
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|_[^_\n]+_|`[^`\n]+`)/g);

    return parts.filter(Boolean).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={i} className="bg-[#14120F] border border-[#2B2723] rounded px-1.5 py-0.5 text-[0.9em] text-white">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (
        ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) &&
        part.length > 2
      ) {
        return <em key={i} className="italic text-[#C4B8A8]">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col min-h-[calc(100vh-5rem)]">

      {/* Top controls */}
      <div className="flex items-center justify-between gap-3 pb-4">
        {isSignedIn ? (
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="flex items-center gap-2 border border-[#3A332C] bg-[#1C1917] hover:bg-[#2B2723] text-[#A89C8D] hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition"
            aria-expanded={panelOpen}
          >
            <span>
              {panelOpen ? 'Hide' : 'Past chats & memory'}
              {!panelOpen && conversations.length > 0 ? ` (${conversations.length})` : ''}
            </span>
          </button>
        ) : (
          <span className="text-xs text-[#7A6F62]">
            Sign in and the coach remembers your training between sessions.
          </span>
        )}

        {messages.length > 0 && (
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 border border-[#3A332C] bg-[#1C1917] hover:bg-[#2B2723] text-[#A89C8D] hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition"
            title="Start a new conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New chat</span>
          </button>
        )}
      </div>

      {/* Past conversations + what the coach remembers */}
      {isSignedIn && panelOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
          <section className="bg-[#1C1917] border border-[#3A332C] rounded-2xl p-5 space-y-3">
            <h2 className="label">Past chats</h2>
            {conversations.length === 0 ? (
              <p className="text-xs text-[#7A6F62]">
                Nothing yet. Ask the coach something and it&apos;ll be saved here.
              </p>
            ) : (
              <ul className="space-y-1.5 max-h-56 overflow-y-auto">
                {conversations.map((c) => (
                  <li key={c._id} className="flex items-center gap-2">
                    <button
                      onClick={() => openConversation(c._id)}
                      className={`flex-1 text-left px-3 py-2 rounded-lg text-xs transition ${
                        c._id === conversationId
                          ? 'bg-[#2B2723] text-white'
                          : 'text-[#A89C8D] hover:bg-[#232019] hover:text-white'
                      }`}
                    >
                      <span className="block truncate">{c.title}</span>
                      <span className="stat block text-[10px] text-[#7A6F62] mt-0.5">
                        {c.messageCount} messages · {new Date(c.updatedAt).toLocaleDateString()}
                      </span>
                    </button>
                    <button
                      onClick={() => deleteConversation(c._id)}
                      className="text-[#7A6F62] hover:text-white transition text-xs px-1.5"
                      title="Delete this chat"
                      aria-label={`Delete chat: ${c.title}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-[#1C1917] border border-[#3A332C] rounded-2xl p-5 space-y-3">
            <h2 className="label">What the coach remembers</h2>
            <p className="text-xs text-[#7A6F62] leading-relaxed">
              The coach picks these up as you talk, and you can add your own. It uses them in
              every answer — delete anything you don&apos;t want it to know.
            </p>

            {memory.length > 0 && (
              <ul className="space-y-1.5">
                {memory.map((entry) => (
                  <li
                    key={entry.text}
                    className="flex items-start gap-2 bg-[#14120F] border border-[#2B2723] rounded-lg px-3 py-2"
                  >
                    <span className="flex-1 text-xs text-[#A89C8D] leading-relaxed">
                      {entry.text}
                      <span
                        className="stat ml-2 text-[10px] uppercase tracking-wider"
                        style={{ color: entry.source === 'coach' ? '#4FA3A5' : '#7A6F62' }}
                      >
                        {entry.source === 'coach' ? 'picked up' : 'you told it'}
                      </span>
                    </span>
                    <button
                      onClick={() => forgetFact(entry.text)}
                      className="text-[#7A6F62] hover:text-white transition text-xs"
                      title="Forget this"
                      aria-label={`Forget: ${entry.text}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={addFact} className="flex items-center gap-2">
              <input
                value={newFact}
                onChange={(e) => setNewFact(e.target.value)}
                placeholder="e.g. Left ankle gives me trouble on landings"
                maxLength={160}
                className="flex-1 bg-[#14120F] border border-[#2B2723] text-white placeholder:text-[#7A6F62] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#4A4139] transition"
              />
              <button
                type="submit"
                className="bg-white text-[#14120F] px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/90 transition"
              >
                Remember
              </button>
            </form>

            {memoryError && <p className="text-xs text-red-400">{memoryError}</p>}
          </section>
        </div>
      )}

      {/* ── CHAT CONTAINER / EMPTY STATE ── */}
      <div className="flex-1 py-4 overflow-y-auto space-y-8">
        
        {/* Welcome Empty State (Claude Style) */}
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto py-16 text-center space-y-8">
            <div className="flex items-center justify-center gap-4">
              <PixelFlame size={40} />
              <PixelSoccerBall size={40} />
              <PixelTrophy size={40} />
            </div>

            <div className="space-y-3">
              <h2 className="text-5xl font-extrabold text-white tracking-tight">
                How can I help you train today?
              </h2>
              <p className="text-sm text-[#A89C8D] max-w-lg mx-auto leading-relaxed">
                Ask for custom warmup routines, athletic recovery advice, position-specific drills, or tactical strategies.
              </p>
            </div>

            {/* 2x2 Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
              {suggestionCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(card.prompt)}
                    className="bg-[#1C1917] border border-[#3A332C] p-5 rounded-2xl hover:border-[#7A6F62] hover:bg-[#232019] transition-all group text-left flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] uppercase tracking-wider text-[#7A6F62] font-semibold">
                        {card.sport}
                      </span>
                      <Icon className="w-4 h-4 text-[#A89C8D] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#FFFFFF] transition-colors mb-1">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#A89C8D] line-clamp-2 leading-relaxed">
                        {card.prompt}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            
            {/* User Message */}
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-[#232019] border border-[#3A332C] rounded-2xl px-5 py-3.5 max-w-[85%] sm:max-w-[75%] shadow-sm">
                  {msg.isFallback && (
                    <div className="mb-3 text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-900/40 rounded-lg px-3 py-2 leading-relaxed">
                      Generic template — not a personalised AI response.
                      {msg.fallbackReason ? ` ${msg.fallbackReason}` : ''}
                    </div>
                  )}
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {msg.learned?.length > 0 && (
                    <div className="mt-3 text-[11px] text-[#4FA3A5] bg-[#4FA3A5]/10 border border-[#4FA3A5]/25 rounded-lg px-3 py-2 leading-relaxed">
                      <span className="font-semibold">Noted for next time:</span>{' '}
                      {msg.learned.join(' · ')}
                    </div>
                  )}
                  {msg.timestamp && (
                    <div className="text-[10px] text-[#7A6F62] text-right mt-1.5 font-mono">{msg.timestamp}</div>
                  )}
                </div>
              </div>
            ) : (
              /* Assistant Message (Claude Style Full-Width Response) */
              <div className="flex gap-4 items-start py-2">
                <div className="w-8 h-8 rounded-xl bg-[#1C1917] border border-[#3A332C] flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="text-sm text-[#A89C8D] leading-relaxed">
                    {renderFormattedContent(msg.content)}
                  </div>

                  {/* Response Action Bar */}
                  <div className="flex items-center gap-3 pt-2 text-[#7A6F62]">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1.5 text-xs hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#1C1917]"
                      title="Copy to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => msg.sourcePrompt && handleSend(msg.sourcePrompt)}
                      disabled={!msg.sourcePrompt}
                      className="flex items-center gap-1.5 text-xs hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#1C1917]"
                      title="Regenerate response"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>

                    {msg.timestamp && (
                      <span className="text-[10px] text-[#4A4139] font-mono ml-auto">{msg.timestamp}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-4 items-center py-4">
            <div className="w-8 h-8 rounded-xl bg-[#1C1917] border border-[#3A332C] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A89C8D] font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>TrainBot is crafting your custom protocol...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── FLOATING INPUT BAR (Claude Style) ── */}
      <div className="sticky bottom-4 pt-2 bg-[#14120F]/80 backdrop-blur-md">
        <div className="bg-[#1C1917] border border-[#3A332C] focus-within:border-[#8B8073] rounded-2xl p-3 transition-all shadow-2xl space-y-2">

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Ask TrainBot anything about ${selectedSport === 'All' ? 'your training' : selectedSport}...`}
            className="w-full bg-transparent text-white placeholder:text-[#7A6F62] text-sm focus:outline-none resize-none max-h-44 px-2 py-1 leading-relaxed"
          />

          {/* Input Controls Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2B2723]">
            
            {/* Sport Context Chip Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#7A6F62] uppercase tracking-wider font-semibold">Sport Context:</span>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="bg-[#14120F] border border-[#3A332C] text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#7A6F62] cursor-pointer transition"
              >
                <option value="All">General Sports</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.name}>{sport.name}</option>
                ))}
              </select>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[10px] text-[#4A4139] font-mono">
                Shift + Enter for new line
              </span>
              
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-xl transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-white text-[#14120F] hover:bg-[#FFFFFF] scale-100'
                    : 'bg-[#2B2723] text-[#7A6F62] cursor-not-allowed opacity-50'
                }`}
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 font-bold" />
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

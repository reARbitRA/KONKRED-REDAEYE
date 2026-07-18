import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Shield, Trash2, CheckCircle2, AlertCircle, ExternalLink, Plus, Search, Globe } from 'lucide-react';
import { useAPIKey } from '../contexts/APIKeyContext';
import { LLMProvider, ModelInfo } from '../types';
import { ALL_PROVIDERS } from '../codex-data/providers';

export const KeyManager: React.FC = () => {
    const { userKeys, addUserKey, removeUserKey, validateAndFetchModels, addModels, getModelsForProvider, selectedModel, setSelectedModel } = useAPIKey();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAdding, setIsAdding] = useState<LLMProvider | null>(null);
    const [newKey, setNewKey] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filteredProviders = ALL_PROVIDERS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddKey = async (providerId: LLMProvider) => {
        if (!newKey.trim()) return;
        
        setIsValidating(true);
        setError(null);
        
        try {
            const models = await validateAndFetchModels(providerId, newKey);
            addUserKey(providerId, newKey);
            addModels(providerId, models);
            setIsAdding(null);
            setNewKey('');
        } catch (err: any) {
            setError(err.message || 'Validation failed');
        } finally {
            setIsValidating(false);
        }
    };

    const isKeyConfigured = (providerId: LLMProvider) => {
        return userKeys.some(k => k.providerId === providerId);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 font-mono">
            <header className="space-y-2 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3 text-emerald-500">
                    <Shield className="w-6 h-6" />
                    <h1 className="text-2xl font-bold tracking-tighter uppercase italic">Sovereign Key Vault</h1>
                </div>
                <p className="text-zinc-400 text-sm max-w-2xl">
                    Manage your adversarial node links. Keys are stored locally in your browser's encrypted substrate. 
                    No data ever leaves this terminal except to the direct provider endpoints.
                </p>
            </header>

            <div className="space-y-4">
                <h2 className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Linked API Keys</h2>
                <div className="space-y-2">
                    {userKeys.map(key => {
                        const provider = ALL_PROVIDERS.find(p => p.id === key.providerId);
                        return (
                            <div key={key.providerId} className="flex items-center justify-between bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: provider?.color || '#ffffff' }} />
                                    <span className="text-sm font-bold text-zinc-300">{provider?.name || key.providerId}</span>
                                </div>
                                <button 
                                    onClick={() => removeUserKey(key.providerId)}
                                    className="text-zinc-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                    {userKeys.length === 0 && (
                        <p className="text-xs text-zinc-600 italic">No API keys configured.</p>
                    )}
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                    type="text"
                    placeholder="SEARCH PROVIDERS..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredProviders.map((provider) => {
                        const configured = isKeyConfigured(provider.id);
                        const models = getModelsForProvider(provider.id);
                        const isSelected = selectedModel?.provider === provider.id;

                        return (
                            <motion.div
                                key={provider.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group relative bg-zinc-900/50 border ${configured ? 'border-emerald-500/30' : 'border-white/5'} rounded-xl p-5 hover:bg-zinc-800/50 transition-all`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">{provider.name}</h3>
                                        <p className="text-[10px] text-zinc-500 uppercase">{provider.id}</p>
                                    </div>
                                    {configured ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                        <Globe className="w-4 h-4 text-zinc-700" />
                                    )}
                                </div>

                                <p className="text-xs text-zinc-400 mb-6 line-clamp-2 leading-relaxed">
                                    {provider.description}
                                </p>

                                <div className="space-y-3">
                                    {configured ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-[10px] uppercase text-zinc-500">
                                                <span>Active Models: {models.length}</span>
                                                <button 
                                                    onClick={() => removeUserKey(provider.id)}
                                                    className="hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                            
                                            <select 
                                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[10px] text-zinc-300 focus:outline-none focus:border-emerald-500/30"
                                                value={isSelected ? selectedModel.modelId : ''}
                                                onChange={(e) => setSelectedModel(provider.id, e.target.value)}
                                            >
                                                <option value="" disabled>SELECT ACTIVE MODEL</option>
                                                {models.map(m => (
                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                ))}
                                            </select>

                                            <div className="flex gap-2">
                                                <a 
                                                    href={provider.docsUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded py-2 text-[10px] uppercase transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    Docs
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {isAdding === provider.id ? (
                                                <div className="space-y-2">
                                                    <input 
                                                        autoFocus
                                                        type="password"
                                                        placeholder="ENTER API KEY..."
                                                        className="w-full bg-black border border-emerald-500/30 rounded px-3 py-2 text-xs focus:outline-none"
                                                        value={newKey}
                                                        onChange={(e) => setNewKey(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleAddKey(provider.id)}
                                                    />
                                                    {error && (
                                                        <div className="flex items-center gap-2 text-[9px] text-red-400 uppercase">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {error}
                                                        </div>
                                                    )}
                                                    <div className="flex gap-2">
                                                        <button 
                                                            disabled={isValidating}
                                                            onClick={() => handleAddKey(provider.id)}
                                                            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 rounded py-2 text-[10px] uppercase font-bold transition-all disabled:opacity-50"
                                                        >
                                                            {isValidating ? 'VALIDATING...' : 'ESTABLISH LINK'}
                                                        </button>
                                                        <button 
                                                            onClick={() => { setIsAdding(null); setError(null); }}
                                                            className="px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] uppercase"
                                                        >
                                                            CANCEL
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => setIsAdding(provider.id)}
                                                    className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-500 rounded py-2.5 text-[10px] uppercase font-bold transition-all"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    CONFIGURE LINK
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

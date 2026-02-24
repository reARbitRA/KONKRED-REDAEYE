import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Key, ShieldCheck, Activity, Trash2, 
  Plus, CheckCircle2, AlertCircle, Cpu, Globe, 
  ChevronRight, Search, Zap
} from 'lucide-react';
import { useAPIKey } from '../contexts/APIKeyContext';
import { LLMProvider, ModelInfo } from '../types';

const PROVIDERS = [
  { id: LLMProvider.GOOGLE, name: 'Google Gemini', icon: Globe, color: 'text-blue-400' },
  { id: LLMProvider.GROQ, name: 'Groq', icon: Cpu, color: 'text-orange-400' },
  { id: LLMProvider.OPENAI, name: 'OpenAI', icon: Activity, color: 'text-emerald-400' },
  { id: LLMProvider.OPENROUTER, name: 'OpenRouter', icon: Globe, color: 'text-purple-400' },
  { id: LLMProvider.DEEPSEEK, name: 'DeepSeek', icon: Search, color: 'text-cyan-400' },
  { id: LLMProvider.MISTRAL, name: 'Mistral', icon: Cpu, color: 'text-orange-300' },
  { id: LLMProvider.TOGETHER, name: 'Together AI', icon: Activity, color: 'text-blue-300' },
  { id: LLMProvider.SAMBANOVA, name: 'SambaNova', icon: Zap, color: 'text-yellow-400' },
  { id: LLMProvider.XAI, name: 'xAI (Grok)', icon: ShieldCheck, color: 'text-white' },
];

export const SettingsPage: React.FC = () => {
  const { 
    userKeys, addUserKey, removeUserKey, 
    availableModels, addModels, 
    selectedModel, setSelectedModel,
    validateAndFetchModels
  } = useAPIKey();

  const [selectedProviderId, setSelectedProviderId] = useState<LLMProvider>(LLMProvider.GOOGLE);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddKey = async () => {
    if (!apiKeyInput.trim()) return;
    
    setIsValidating(true);
    setError(null);
    
    try {
      const models = await validateAndFetchModels(selectedProviderId, apiKeyInput);
      addUserKey(selectedProviderId, apiKeyInput);
      addModels(selectedProviderId, models);
      setApiKeyInput('');
      
      // Auto-select first model if none selected
      if (!selectedModel && models.length > 0) {
          setSelectedModel(selectedProviderId, models[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Validation failed.");
    } finally {
      setIsValidating(false);
    }
  };

  const filteredModels = availableModels.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto custom-scrollbar">
      <div className="bg-secondary/80 border border-border-primary rounded-sm p-6 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-xl pointer-events-none" />
        <h1 className="text-2xl font-black technical-font text-white uppercase tracking-widest flex items-center gap-3 mb-2">
          <Settings className="text-accent" />
          System_Configuration
        </h1>
        <p className="text-xs text-text-secondary font-mono max-w-2xl">
          Manage LLM provider nodes, API credentials, and active model routing. 
          All keys are stored locally in your browser's encrypted storage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Management */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-black/40 border border-border-primary rounded-sm p-4">
            <h3 className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
              <Key size={14} /> Provider_Nodes
            </h3>
            
            <div className="space-y-2">
              {PROVIDERS.map(provider => {
                const hasKey = userKeys.some(k => k.providerId === provider.id);
                return (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProviderId(provider.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-sm border transition-all ${selectedProviderId === provider.id ? 'bg-accent/10 border-accent' : 'bg-tertiary/20 border-border-primary/50 hover:border-accent/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <provider.icon size={16} className={provider.color} />
                      <span className="text-sm font-mono text-white">{provider.name}</span>
                    </div>
                    {hasKey && <CheckCircle2 size={14} className="text-success" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-black/40 border border-border-primary rounded-sm p-4">
            <h3 className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
              <Plus size={14} /> Add_Credentials
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black technical-font text-text-secondary uppercase mb-1 block">API_KEY</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={`Enter ${selectedProviderId} Key...`}
                    className="flex-1 bg-primary/60 border border-border-primary focus:border-accent rounded-sm p-2 text-xs font-mono text-white outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddKey}
                    disabled={isValidating || !apiKeyInput.trim()}
                    className="bg-accent text-white px-4 rounded-sm font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                  >
                    {isValidating ? '...' : 'LINK'}
                  </motion.button>
                </div>
                {error && <p className="text-[10px] text-danger mt-2 font-mono flex items-center gap-1"><AlertCircle size={10}/> {error}</p>}
              </div>

              <div className="pt-4 border-t border-border-primary/30">
                <h4 className="text-[10px] font-black technical-font text-text-secondary uppercase mb-2">Linked_Nodes</h4>
                <div className="space-y-2">
                  {userKeys.map(key => (
                    <div key={key.providerId} className="flex items-center justify-between bg-tertiary/30 p-2 rounded-sm border border-border-primary/30">
                      <span className="text-[10px] font-mono text-white">{key.providerId}</span>
                      <button 
                        onClick={() => removeUserKey(key.providerId)}
                        className="text-text-secondary hover:text-danger transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {userKeys.length === 0 && <p className="text-[10px] text-text-secondary italic font-mono">No nodes linked.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Selection */}
        <div className="lg:col-span-2 bg-black/40 border border-border-primary rounded-sm p-4 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black technical-font text-text-secondary uppercase tracking-widest flex items-center gap-2">
              <Cpu size={14} /> Model_Substrate_Registry
            </h3>
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="bg-primary/40 border border-border-primary rounded-sm pl-7 pr-2 py-1 text-[10px] font-mono text-white outline-none focus:border-accent w-48"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredModels.map(model => {
                const isSelected = selectedModel?.modelId === model.id && selectedModel?.provider === model.provider;
                return (
                  <motion.button
                    key={`${model.provider}-${model.id}`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedModel(model.provider, model.id)}
                    className={`flex flex-col p-3 rounded-sm border text-left transition-all ${isSelected ? 'bg-accent/10 border-accent shadow-glow-accent' : 'bg-tertiary/20 border-border-primary/50 hover:border-accent/30'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black technical-font uppercase ${isSelected ? 'text-accent' : 'text-text-secondary'}`}>
                        {model.provider}
                      </span>
                      {isSelected && <ShieldCheck size={12} className="text-accent" />}
                    </div>
                    <span className="text-sm font-mono text-white mb-1 truncate">{model.name}</span>
                    <div className="flex gap-1">
                      {model.modalities.map(m => (
                        <span key={m} className="text-[8px] bg-black/40 px-1 rounded-sm text-text-secondary font-mono">{m}</span>
                      ))}
                    </div>
                  </motion.button>
                );
              })}
              {filteredModels.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-30">
                  <Cpu size={48} className="mb-4" />
                  <p className="text-xs font-mono uppercase tracking-widest">No models discovered.</p>
                </div>
              )}
            </div>
          </div>

          {selectedModel && (
            <div className="mt-6 p-4 bg-accent/5 border border-accent/30 rounded-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <Activity size={20} className="text-accent animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black technical-font text-white uppercase tracking-widest">Active_Node_Link</h4>
                  <p className="text-[10px] font-mono text-accent-light">{selectedModel.provider} // {selectedModel.modelId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-success">
                <CheckCircle2 size={12} />
                <span>READY_FOR_EXECUTION</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

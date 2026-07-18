import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Book, LayoutGrid, List, Search, SlidersHorizontal, ShieldAlert } from 'lucide-react';
import { Technique } from '../types';
import { CODEX_SECTIONS, ALL_TECHNIQUES } from '../services/codex_sections';
import { TechniqueCard } from './shared/TechniqueCard';
import { Modal } from './shared/Modal';
import { TechniqueDetail } from './TechniqueDetail';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const LibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useLocalStorage('redaeye-library-search', '');
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('redaeye-library-view', 'grid');
  const [selectedTechniqueId, setSelectedTechniqueId] = useLocalStorage<string | null>('redaeye-selected-tech', null);

  const selectedTechnique = useMemo(() => {
    if (!selectedTechniqueId) return null;
    return ALL_TECHNIQUES.find(t => t.id === selectedTechniqueId) || null;
  }, [selectedTechniqueId]);

  const setSelectedTechnique = (tech: Technique | null) => {
    setSelectedTechniqueId(tech ? tech.id : null);
  };

  const filteredSections = useMemo(() => {
    return CODEX_SECTIONS.map(section => ({
      ...section,
      techniques: section.techniques.filter(tech => {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = tech.name.toLowerCase().includes(searchLower);
        const descriptionMatch = (tech.description || tech.briefDescription || tech.fullDescription || tech.objective || '').toLowerCase().includes(searchLower);
        const tagsMatch = (tech.tags || tech.metadata?.tags || []).some(tag => tag.toLowerCase().includes(searchLower));
        return nameMatch || descriptionMatch || tagsMatch;
      })
    })).filter(section => section.techniques.length > 0 && section.id !== 'RAE-24');
  }, [searchTerm]);

  const totalFiltered = useMemo(() => 
    filteredSections.reduce((acc, sec) => acc + sec.techniques.length, 0)
  , [filteredSections]);

  const handleTechniqueClick = React.useCallback((tech: Technique) => {
    setSelectedTechnique(tech);
  }, [setSelectedTechnique]);

  return (
    <>
      <div className="flex-1 flex flex-col text-text-primary p-4 md:p-6 bg-primary/50 min-h-0">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-accent/10 border border-accent/30 rounded-sm flex items-center justify-center">
                    <Book className="text-accent" size={24} />
                </div>
                <div>
                    <h1 className="text-4xl font-black technical-font uppercase tracking-widest">Technique_Codex</h1>
                    <p className="text-sm text-text-secondary font-mono opacity-70">A comprehensive library of Redaeye Prime exploits and adversarial techniques.</p>
                </div>
            </div>
            <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2 text-danger">
                    <ShieldAlert size={16} />
                    <span className="text-sm font-bold technical-font uppercase tracking-widest">Sovereign Vectors Active</span>
                </div>
                <span className="text-2xl font-black font-mono text-white">{ALL_TECHNIQUES.length}</span>
            </div>
          </div>
        </header>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input 
                  type="text"
                  placeholder="Search by name, tag, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-secondary/80 border border-border-primary rounded-sm py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              />
          </div>
          <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-3 bg-secondary/80 border border-border-primary rounded-sm text-text-secondary hover:text-white transition-colors">
                  <SlidersHorizontal size={16} />
                  <span className="text-sm">Filters</span>
              </button>
              <div className="bg-border-primary h-full w-px" />
              <button onClick={() => setViewMode('grid')} className={`px-3 py-3 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-accent/20 text-accent' : 'bg-secondary/80 text-text-secondary hover:text-white'}`}>
                  <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-3 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-accent/20 text-accent' : 'bg-secondary/80 text-text-secondary hover:text-white'}`}>
                  <List size={18} />
              </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4">
          {filteredSections.map((section) => (
            <div key={section.id} className="mb-12">
              <div className="flex items-center gap-4 mb-6 border-b border-border-primary pb-2">
                <h2 className="text-xl font-black technical-font uppercase tracking-widest text-white">{section.id} <span className="text-text-secondary font-normal mx-2">|</span> {section.title}</h2>
                <div className="flex-1" />
                <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded-sm border border-accent/20">
                  {section.techniques.length} Vectors
                </span>
              </div>
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {section.techniques.map((tech) => (
                      <TechniqueItem 
                        key={tech.id} 
                        tech={tech} 
                        onClick={handleTechniqueClick} 
                      />
                  ))}
              </div>
            </div>
          ))}
          {totalFiltered === 0 && (
              <div className="text-center py-20">
                  <p className="text-text-secondary">No techniques found matching your query.</p>
              </div>
          )}
        </div>
      </div>

      <Modal isOpen={!!selectedTechnique} onClose={() => setSelectedTechnique(null)} title={selectedTechnique?.name}>
        {selectedTechnique && <TechniqueDetail technique={selectedTechnique} />}
      </Modal>
    </>
  );
};

const TechniqueItem = React.memo(({ tech, onClick }: { tech: Technique, onClick: (tech: Technique) => void }) => {
  return (
    <div onClick={() => onClick(tech)} className="cursor-pointer h-full">
      <TechniqueCard technique={tech} />
    </div>
  );
});

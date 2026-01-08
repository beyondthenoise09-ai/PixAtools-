
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS } from '../constants';
import { ToolCategory } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const renderCategory = (category: ToolCategory, title: string) => {
    const tools = TOOLS.filter(t => t.category === category);
    return (
      <div className="px-5 mb-8" key={category}>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{title}</h2>
        <div className="grid grid-cols-2 gap-4">
          {tools.map(tool => (
            <div 
              key={tool.id}
              onClick={() => navigate(tool.path)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer group hover:shadow-md"
            >
              <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">{tool.icon}</div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{tool.name}</h3>
              <p className="text-[11px] text-gray-500 leading-tight">{tool.description}</p>
              {tool.ai && (
                <span className="mt-2 inline-block px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold rounded uppercase">AI Power</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-6 animate-in fade-in duration-500">
      <div className="px-5 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Make Passport Photos</h2>
            <p className="text-blue-100 text-sm opacity-90 mb-4">Pro results in seconds with AI cutout.</p>
            <button 
              onClick={() => navigate('/passport')}
              className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:bg-blue-50"
            >
              Start Hero Tool
            </button>
          </div>
          <div className="absolute right-[-10px] bottom-[-20px] text-8xl opacity-10 pointer-events-none">📸</div>
        </div>
      </div>

      {renderCategory(ToolCategory.CORE, 'Core AI Utilities')}
      {renderCategory(ToolCategory.EDIT, 'Fast Editing')}
      {renderCategory(ToolCategory.CONVERT, 'Convert & Export')}
      {renderCategory(ToolCategory.EXTRAS, 'Personal')}
      
      <div className="px-5 pb-10 text-center">
        <p className="text-[10px] text-gray-400 font-medium">PixAtools v1.0 • Privacy First • Local Processing</p>
      </div>
    </div>
  );
};

export default Home;

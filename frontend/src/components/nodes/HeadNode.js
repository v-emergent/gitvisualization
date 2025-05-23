import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useThemeStore } from '../../store/themeStore';

function HeadNode({ data }) {
  const { theme } = useThemeStore();
  
  return (
    <div 
      className={`px-5 py-3 rounded-lg text-base font-bold shadow-lg flex items-center ${
        data.detached
          ? 'bg-red-600 text-white'
          : theme === 'dark'
            ? 'bg-red-700 text-white'
            : 'bg-red-100 text-red-800 border-2 border-red-400'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
      <span>{data.label}</span>
      {data.detached && (
        <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
          Detached
        </span>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-5 h-5 !right-0 border-2 bg-red-400"
      />
    </div>
  );
}

export default memo(HeadNode);

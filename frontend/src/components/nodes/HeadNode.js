import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useThemeStore } from '../../store/themeStore';

function HeadNode({ data }) {
  const { theme } = useThemeStore();
  
  return (
    <div 
      className={`px-3 py-1 rounded-lg text-sm font-bold ${
        data.detached
          ? 'bg-red-600 text-white'
          : theme === 'dark'
            ? 'bg-red-700 text-white'
            : 'bg-red-100 text-red-800 border border-red-300'
      }`}
    >
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !right-0 border-2 bg-gray-200"
      />
    </div>
  );
}

export default memo(HeadNode);

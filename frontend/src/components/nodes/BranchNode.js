import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useThemeStore } from '../../store/themeStore';

function BranchNode({ data }) {
  const { theme } = useThemeStore();
  
  return (
    <div 
      className={`px-3 py-1 rounded-full text-sm ${
        data.isCurrent
          ? 'bg-green-600 text-white font-medium'
          : theme === 'dark'
            ? 'bg-gray-700 text-gray-200'
            : 'bg-gray-200 text-gray-800'
      }`}
    >
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 !left-0 border-2 bg-gray-200"
      />
      {data.label}
    </div>
  );
}

export default memo(BranchNode);

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useThemeStore } from '../../store/themeStore';

function BranchNode({ data }) {
  const { theme } = useThemeStore();
  
  return (
    <div 
      className={`px-6 py-3 rounded-full text-base font-semibold shadow-lg flex items-center ${
        data.isCurrent
          ? 'bg-green-600 text-white font-semibold'
          : theme === 'dark'
            ? 'bg-gray-700 text-gray-200'
            : 'bg-gray-200 text-gray-800'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
      <span>{data.label}</span>
      <Handle
        type="source"
        position={Position.Left}
        className="w-5 h-5 !left-0 border-2 bg-green-500"
      />
    </div>
  );
}

export default memo(BranchNode);

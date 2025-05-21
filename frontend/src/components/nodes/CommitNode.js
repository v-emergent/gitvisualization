import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useThemeStore } from '../../store/themeStore';

function CommitNode({ data }) {
  const { theme } = useThemeStore();
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatDate = (timestamp) => {
    return dateFormatter.format(new Date(timestamp));
  };

  return (
    <div 
      className={`px-4 py-2 rounded-lg border-2 font-mono text-sm ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-300 text-gray-900'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 border-2 bg-gray-200"
      />
      <div className="flex items-center">
        <div 
          className="w-3 h-3 rounded-full mr-2" 
          style={{ backgroundColor: data.color || '#10b981' }} 
        />
        <div className="font-bold">{data.id}</div>
      </div>
      <div className="mt-1 text-xs">{data.label}</div>
      {data.author && (
        <div className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {data.author} • {formatDate(data.timestamp)}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 border-2 bg-gray-200"
      />
    </div>
  );
}

export default memo(CommitNode);

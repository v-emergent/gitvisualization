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
      className={`px-6 py-4 rounded-xl border-2 font-mono text-base shadow-lg min-w-[240px] ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-600 text-white' 
          : 'bg-white border-gray-300 text-gray-900'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-5 h-5 border-2 left-[-10px] bg-gray-200"
      />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div 
            className="w-5 h-5 rounded-full mr-3" 
            style={{ backgroundColor: data.color || '#10b981' }} 
          />
          <div className="font-bold text-lg">{data.id}</div>
        </div>
        {data.files && data.files.length > 0 && (
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {data.files.length} file{data.files.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
      <div className="my-2 p-2 border-l-4 border-gray-500 pl-3">{data.label}</div>
      {data.author && (
        <div className={`mt-2 text-sm flex justify-between items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>{data.author}</span>
          <span className="text-xs">{formatDate(data.timestamp)}</span>
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-5 h-5 border-2 right-[-10px] bg-gray-200"
      />
    </div>
  );
}

export default memo(CommitNode);

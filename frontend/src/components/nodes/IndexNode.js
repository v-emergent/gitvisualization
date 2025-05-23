import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useThemeStore } from '../../store/themeStore';

function IndexNode({ data }) {
  const { theme } = useThemeStore();
  
  return (
    <div 
      className={`px-6 py-4 rounded-xl border-2 font-mono shadow-lg min-w-[220px] ${
        theme === 'dark' 
          ? 'bg-blue-900 border-blue-700 text-white' 
          : 'bg-blue-50 border-blue-300 text-gray-900'
      }`}
    >
      <div className="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <div className="font-bold text-lg">Staging Area</div>
      </div>
      
      <div className="mt-2 text-sm">
        {data.files && data.files.length > 0 ? (
          <ul className="space-y-1 max-h-[100px] overflow-y-auto">
            {data.files.map((file, index) => (
              <li key={index} className="flex items-center">
                <span className={`mr-2 ${file.status === 'modified' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {file.status === 'modified' ? 'M' : 'A'}
                </span>
                <span className="truncate">{file.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 italic">No staged changes</div>
        )}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-5 h-5 border-2 bg-gray-200"
        id="working-to-index"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-5 h-5 border-2 bg-gray-200"
        id="index-to-commit"
      />
    </div>
  );
}

export default memo(IndexNode);

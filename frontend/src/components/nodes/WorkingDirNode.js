import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useThemeStore } from '../../store/themeStore';

function WorkingDirNode({ data }) {
  const { theme } = useThemeStore();
  
  return (
    <div 
      className={`px-6 py-4 rounded-xl border-2 font-mono shadow-lg min-w-[220px] ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700 text-white' 
          : 'bg-gray-50 border-gray-300 text-gray-900'
      }`}
    >
      <div className="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <div className="font-bold text-lg">Working Directory</div>
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
          <div className="text-gray-500 italic">No changes</div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-5 h-5 border-2 bg-gray-200"
        id="working-to-index"
      />
    </div>
  );
}

export default memo(WorkingDirNode);

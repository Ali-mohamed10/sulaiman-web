import { Link } from 'react-router-dom';

// Add CSS animation for the fadeIn effect
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

const ToolCard = ({ icon: Icon, title, description, to, delay = 0 }) => {
  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden hover:-translate-y-1"
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        animation: `fadeIn 0.3s ${delay * 0.1}s forwards`,
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-[--color-primary]/5 to-[--color-secondary]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-[--color-primary]/10 dark:bg-[--color-primary]/20 flex items-center justify-center mb-4 text-[--color-primary] dark:text-[--color-primary-light]">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
        
        <Link
          to={to}
          className="inline-flex items-center text-sm font-medium text-[--color-primary] dark:text-[--color-primary-light] group-hover:underline"
        >
          Try it now
          <svg
            className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ToolCard;

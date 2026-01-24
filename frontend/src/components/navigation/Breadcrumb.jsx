import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <motion.li
              key={index}
              className="inline-flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {index > 0 && (
                <svg
                  className="w-6 h-6 text-gray-400 mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              
              {isLast ? (
                <span className="text-sm font-medium text-gray-500">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  {item.icon && (
                    <span className="mr-2">{item.icon}</span>
                  )}
                  {item.label}
                </Link>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {/* Mobile Ellipsis if > 2 items */}
        {items.length > 2 && (
          <li className="inline-flex items-center md:hidden">
            <span className="text-gray-400 text-sm">...</span>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          // Hide items on mobile if list is long, keeping only the last 2
          const isHiddenOnMobile = items.length > 2 && index < items.length - 2;

          return (
            <motion.li
              key={index}
              className={`inline-flex items-center ${isHiddenOnMobile ? "hidden md:inline-flex" : ""}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {index > 0 && (
                <svg
                  className="w-4 h-4 md:w-6 md:h-6 text-gray-400 mx-1 flex-shrink-0"
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
                <span className="text-xs md:text-sm font-medium text-gray-500 truncate max-w-[150px] md:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="inline-flex items-center text-xs md:text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200 truncate max-w-[100px] md:max-w-none"
                >
                  {item.icon && (
                    <span className="mr-2 flex-shrink-0">{item.icon}</span>
                  )}
                  <span className="truncate">{item.label}</span>
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

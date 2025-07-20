/**
 * Component Template
 *
 * This is a standard template for creating new components.
 * Copy this file, rename it, and customize it for your component.
 */
import React from 'react';

// Define the props interface
interface ComponentProps {
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Component - [Replace with component description]
 *
 * @param props - Component props
 * @returns React component
 */
export const Component: React.FC<ComponentProps> = ({
  title = 'Default Title',
  description,
  className = '',
  children,
}) => {
  // State management (if needed)
  const [isOpen, setIsOpen] = React.useState(false);

  // Event handlers
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Component logic
  const combinedClassName = `component-base ${className}`.trim();

  return (
    <div className={combinedClassName}>
      <h2 className="text-xl font-bold">{title}</h2>

      {description && <p className="text-gray-600">{description}</p>}

      <button type="button" className="px-4 py-2 bg-primary text-white rounded" onClick={handleClick}>
        {isOpen ? 'Close' : 'Open'}
      </button>

      {isOpen && <div className="p-4 mt-2 bg-gray-100 rounded">{children || <p>No content provided</p>}</div>}
    </div>
  );
};

export default Component;

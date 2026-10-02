import React from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Standard Mathematical Formula Viewer using KaTeX (Computer Modern Math typesetting)
 */
export const MathView: React.FC<MathViewProps> = ({ math, displayMode = false, className = '' }) => {
  try {
    const html = katex.renderToString(math, {
      throwOnError: false,
      displayMode,
      output: 'htmlAndMathml',
      strict: false
    });

    return (
      <span
        className={`font-serif tracking-normal ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <span className={`font-mono ${className}`}>{math}</span>;
  }
};

/**
 * Parses mixed text and math ($...$ or plain text) and renders cleanly
 */
export const RichMathText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  // Split by $...$
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const formula = part.slice(1, -1);
          return <MathView key={index} math={formula} displayMode={false} className="mx-0.5" />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

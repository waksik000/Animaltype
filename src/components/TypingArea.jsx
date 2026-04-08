
import { useEffect } from 'react';

export default function TypingArea ({ lines, typedChars, handleKeyDown, typingRef }) {
    useEffect(() => {
        const currentElement = typingRef.current?.querySelector('.current');
        if (currentElement) {
            currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [typedChars.length]);

    return (<div
          className="typing-container"
          ref={typingRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {lines.map((line, index) => (
            <div key={index} className={index === 0 ? "active-line" : "inactive-line"}>
              {line.split("").map((ch, cIndex) => {
                let status = "pending";
                if (index === 0) {
                  if (cIndex < typedChars.length) status = typedChars[cIndex].status;
                  else if (cIndex === typedChars.length) status = "current"; // подсветка текущей буквы
                }
                return (
                  <span key={cIndex} className={status}>
                    {ch}
                  </span>
                );
              })}
            </div>
          ))}
        </div>)
}
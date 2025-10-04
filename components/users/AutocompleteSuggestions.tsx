import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GenericUser, Student } from '../../types';

const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;

interface AutocompleteSuggestionsProps {
    suggestions: GenericUser[];
    activeSuggestionIndex: number;
    onSelectSuggestion: (suggestion: GenericUser) => void;
    inputValue: string;
    suggestionListId: string;
    optionIdPrefix: string;
    getDisplayName: (user: GenericUser) => string;
}

const AutocompleteSuggestions: React.FC<AutocompleteSuggestionsProps> = ({
    suggestions,
    activeSuggestionIndex,
    onSelectSuggestion,
    inputValue,
    suggestionListId,
    optionIdPrefix,
    getDisplayName,
}) => {
    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;

        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const queryLength = query.length;
        const segments: React.ReactNode[] = [];
        let currentIndex = 0;
        let matchIndex = lowerText.indexOf(lowerQuery, currentIndex);
        let segmentKey = 0;

        while (matchIndex !== -1) {
            if (matchIndex > currentIndex) {
                segments.push(
                    <React.Fragment key={`text-${segmentKey++}`}>
                        {text.slice(currentIndex, matchIndex)}
                    </React.Fragment>,
                );
            }

            const matchText = text.slice(matchIndex, matchIndex + queryLength);
            segments.push(
                <strong key={`match-${segmentKey++}`} className="font-extrabold">
                    {matchText}
                </strong>,
            );

            currentIndex = matchIndex + queryLength;
            matchIndex = lowerText.indexOf(lowerQuery, currentIndex);
        }

        if (currentIndex < text.length) {
            segments.push(
                <React.Fragment key={`text-${segmentKey++}`}>
                    {text.slice(currentIndex)}
                </React.Fragment>,
            );
        }

        return <span>{segments}</span>;
    };

    return (
        <AnimatePresence>
            {suggestions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full w-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                >
                    <ul
                        id={suggestionListId}
                        role="listbox"
                        data-testid="userlist-suggestions"
                    >
                        {suggestions.map((user, index) => {
                            const displayName = getDisplayName(user);
                            const optionId = `${optionIdPrefix}${index}`;

                            return (
                                <li
                                    key={isStudent(user) ? user.documentNumber : user.dni}
                                    id={optionId}
                                    role="option"
                                    aria-selected={index === activeSuggestionIndex}
                                    onClick={() => onSelectSuggestion(user)}
                                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                                        index === activeSuggestionIndex
                                            ? 'bg-indigo-100 dark:bg-indigo-500/20'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                    }`}
                                >
                                    <img src={user.avatarUrl} alt={displayName} className="w-9 h-9 rounded-full" />
                                    <span className="text-base text-slate-700 dark:text-slate-200 capitalize">
                                        {highlightMatch(displayName, inputValue)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AutocompleteSuggestions;
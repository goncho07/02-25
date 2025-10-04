import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GenericUser, Student, SearchTag } from '../../types';
import AutocompleteSuggestions from './AutocompleteSuggestions';

const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;
const getFullName = (user: GenericUser): string => (isStudent(user) ? user.fullName : user.name);

const normalizeText = (text: string) =>
    text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

interface AriaLabelKeys {
    addFilter?: string;
    removeFilter?: string;
}

interface UserListHeaderProps {
    tags: SearchTag[];
    allUsers: GenericUser[];
    onAddTag: (value: string) => void;
    onRemoveTag: (value: string) => void;
    minChars?: number;
    suggestionLimit?: number;
    gradePattern?: RegExp;
    getDisplayName?: (user: GenericUser) => string;
    placeholderKey?: string;
    ariaLabels?: AriaLabelKeys;
    loopNavigation?: boolean;
}

const SUGGESTION_LIST_ID = 'user-suggestions-list';
const OPTION_ID_PREFIX = 'user-suggestion-';
const DEBOUNCE_DELAY = 200;

const UserListHeader: React.FC<UserListHeaderProps> = ({
    tags,
    allUsers,
    onAddTag,
    onRemoveTag,
    minChars = 2,
    suggestionLimit = 5,
    gradePattern = /^\d{1,2}\s?[A-F]$/i,
    getDisplayName = getFullName,
    placeholderKey = 'ui.userListHeader.placeholder',
    ariaLabels = {
        addFilter: 'ui.userListHeader.aria.addFilter',
        removeFilter: 'ui.userListHeader.aria.removeFilter',
    },
    loopNavigation = false,
}) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const [suggestions, setSuggestions] = useState<GenericUser[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

    const addFilterLabelKey = ariaLabels?.addFilter ?? 'ui.userListHeader.aria.addFilter';
    const removeFilterLabelKey = ariaLabels?.removeFilter ?? 'ui.userListHeader.aria.removeFilter';

    const resetSearch = useCallback(() => {
        setInputValue('');
        setDebouncedValue('');
        setSuggestions([]);
        setActiveSuggestionIndex(-1);
    }, []);

    const handleAddTagAndReset = useCallback(
        (tagValue: string) => {
            if (tagValue.trim()) {
                onAddTag(tagValue.trim());
            }
            resetSearch();
        },
        [onAddTag, resetSearch],
    );

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(handler);
    }, [inputValue]);

    useEffect(() => {
        const trimmedValue = debouncedValue.trim();

        if (trimmedValue.length >= minChars) {
            const gradeRegex = new RegExp(gradePattern);

            if (gradeRegex.test(trimmedValue)) {
                setSuggestions([]);
                setActiveSuggestionIndex(-1);
                return;
            }

            const normalizedQuery = normalizeText(trimmedValue);
            const filteredSuggestions = allUsers
                .filter((user) => normalizeText(getDisplayName(user)).includes(normalizedQuery))
                .slice(0, Math.max(suggestionLimit, 0));

            setActiveSuggestionIndex(-1);
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
            setActiveSuggestionIndex(-1);
        }
    }, [debouncedValue, allUsers, minChars, suggestionLimit, gradePattern, getDisplayName]);

    useEffect(() => {
        if (suggestions.length === 0) {
            setActiveSuggestionIndex(-1);
            return;
        }

        setActiveSuggestionIndex((prev) => {
            if (prev >= suggestions.length) {
                return suggestions.length - 1;
            }
            return prev;
        });
    }, [suggestions]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === 'Tab') && inputValue.trim()) {
            e.preventDefault();
            if (activeSuggestionIndex > -1 && suggestions[activeSuggestionIndex]) {
                handleAddTagAndReset(getDisplayName(suggestions[activeSuggestionIndex]));
            } else {
                handleAddTagAndReset(inputValue);
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            if (!suggestions.length) {
                return;
            }
            e.preventDefault();
            setActiveSuggestionIndex((prev) => {
                const nextIndex = prev + 1;
                if (nextIndex >= suggestions.length) {
                    return loopNavigation ? 0 : suggestions.length - 1;
                }
                return nextIndex;
            });
            return;
        }

        if (e.key === 'ArrowUp') {
            if (!suggestions.length) {
                return;
            }
            e.preventDefault();
            setActiveSuggestionIndex((prev) => {
                if (prev <= -1) {
                    return loopNavigation ? suggestions.length - 1 : -1;
                }
                const nextIndex = prev - 1;
                if (nextIndex < 0) {
                    return loopNavigation ? suggestions.length - 1 : -1;
                }
                return nextIndex;
            });
            return;
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            resetSearch();
        }
    };

    const isPlaceholderVisible = tags.length === 0 && !inputValue;
    const placeholderText = t(placeholderKey);
    const addFilterAriaLabel = t(addFilterLabelKey);

    return (
        <div className="relative">
            <div
                className="relative flex items-center w-full px-4 text-base border border-slate-200 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 dark:text-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition min-h-[52px]"
            >
                <Search className="text-slate-400 pointer-events-none" size={24} />

                <div
                    className="relative flex-1 flex items-center flex-wrap gap-2 ml-3"
                    data-testid="userlist-tags"
                >
                    <AnimatePresence>
                        {isPlaceholderVisible && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                aria-hidden="true"
                                className="absolute inset-y-0 left-0 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none"
                            >
                                <span className="text-lg font-bold">{placeholderText}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {tags.map((tag) => (
                            <motion.div
                                key={tag.value}
                                layout
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className={`flex items-center rounded-full text-sm font-semibold pl-3 ${
                                    tag.isValid
                                        ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200'
                                        : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
                                }`}
                            >
                                {!tag.isValid && <AlertTriangle size={14} className="mr-1.5 shrink-0" />}
                                <span className="pr-2 py-1">{tag.displayValue}</span>
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onRemoveTag(tag.value);
                                    }}
                                    className={`p-1.5 mr-1 rounded-full transition-colors ${
                                        tag.isValid
                                            ? 'hover:bg-indigo-200 dark:hover:bg-indigo-500/30'
                                            : 'hover:bg-rose-200 dark:hover:bg-rose-500/30'
                                    }`}
                                    aria-label={t(removeFilterLabelKey, { filter: tag.displayValue })}
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`flex-grow bg-transparent focus:outline-none p-2 min-w-[200px] text-lg font-bold ${
                            isPlaceholderVisible ? 'caret-transparent' : ''
                        }`}
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={suggestions.length > 0}
                        aria-controls={SUGGESTION_LIST_ID}
                        aria-activedescendant={
                            activeSuggestionIndex >= 0 ? `${OPTION_ID_PREFIX}${activeSuggestionIndex}` : undefined
                        }
                        aria-label={addFilterAriaLabel}
                        autoComplete="off"
                        data-testid="userlist-search-input"
                    />
                </div>
            </div>
            <AutocompleteSuggestions
                suggestions={suggestions}
                activeSuggestionIndex={activeSuggestionIndex}
                onSelectSuggestion={(suggestion) => handleAddTagAndReset(getDisplayName(suggestion))}
                inputValue={inputValue}
                suggestionListId={SUGGESTION_LIST_ID}
                optionIdPrefix={OPTION_ID_PREFIX}
                getDisplayName={getDisplayName}
            />
        </div>
    );
};

export default UserListHeader;
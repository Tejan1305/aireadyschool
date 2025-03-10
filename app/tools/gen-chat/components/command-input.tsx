import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, KeyboardEvent } from "react";
import { useLanguageSettings } from "@/app/hooks/useLanguageSettings";
import { cn } from "@/lib/utils"; // Add this import for the cn utility

const AVAILABLE_COMMANDS = [
  {
    command: "/math",
    description: "Generate math problems",
    examples: ["/math easy addition", "/math medium multiplication"],
  },
  {
    command: "/quiz",
    description: "Create interactive quizzes",
    examples: ["/quiz science easy", "/quiz history medium"],
  },
  {
    command: "/image",
    description: "Generate educational images",
    examples: ["/image solar system realistic", "/image cell structure vector"],
  },
  {
    command: "/visualize",
    description: "Generate interactive visualizations",
    examples: ["/visualize physics gravity", "/visualize biology cell"],
  },
  {
    command: "/mindmap",
    description: "Generate mind maps",
    examples: ["/mindmap machine learning", "/mindmap solar system"],
  },
];

const placeholders = {
  english: {
    thinking: "Thinking...",
    prompt: "Type / for commands or ask a question...",
    viewOnly: "View only - you don't own this chat"
  },
  hindi: {
    thinking: "सोच रहा हूँ...",
    prompt: "कमांड के लिए / टाइप करें या प्रश्न पूछें...",
    viewOnly: "केवल देखें - यह चैट आपके स्वामित्व में नहीं है"
  }
};

type CommandInputProps = {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isOwner?: boolean; // Add this prop
};

export const CommandInput = ({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  isOwner = true, // Set default value
}: CommandInputProps) => {
  const [showCommands, setShowCommands] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(AVAILABLE_COMMANDS);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguageSettings();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange(value);

    if (value.startsWith("/")) {
      setShowCommands(true);
      const searchTerm = value.toLowerCase();
      const filtered = AVAILABLE_COMMANDS.filter((cmd) =>
        cmd.command.toLowerCase().includes(searchTerm)
      );
      setFilteredCommands(filtered);
    } else {
      setShowCommands(false);
      setFilteredCommands(AVAILABLE_COMMANDS);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && showCommands) {
      e.preventDefault();
      const matchingCommand = AVAILABLE_COMMANDS.find((cmd) =>
        cmd.command.toLowerCase().startsWith(input.toLowerCase())
      );
      if (matchingCommand) {
        onInputChange(matchingCommand.command + " ");
        setShowCommands(false);
      }
    }
  };

  const currentPlaceholders = placeholders[language as keyof typeof placeholders] || placeholders.english;
  
  // Determine if input should be disabled
  const isDisabled = isLoading || !isOwner;
  
  // Determine appropriate placeholder text
  const placeholderText = isLoading
    ? currentPlaceholders.thinking
    : !isOwner
    ? currentPlaceholders.viewOnly
    : currentPlaceholders.prompt;

  return (
    <form
      onSubmit={onSubmit}
      className="sticky bottom-0 p-4 bg-white/80 backdrop-blur-sm border-t"
    >
      <div className="relative flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          className={cn(
            "flex-1 p-3 rounded-lg bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all",
            !isOwner && "opacity-70"
          )}
          disabled={isDisabled}
        />
        <Button
          type="submit"
          disabled={isDisabled || !input.trim()}
          className="p-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ArrowUpIcon className="w-4 h-4" />
          )}
        </Button>

        {showCommands && (
          <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
            {filteredCommands.map((cmd) => (
              <button
                key={cmd.command}
                className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors group"
                onClick={() => {
                  onInputChange(cmd.command + " ");
                  setShowCommands(false);
                  inputRef.current?.focus();
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-900">
                    {cmd.command}
                  </span>
                  <span className="text-xs text-neutral-400 group-hover:text-neutral-500">
                    Tab ↹
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {cmd.description}
                </p>
                <div className="flex gap-2 mt-1">
                  {cmd.examples.map((example) => (
                    <span
                      key={example}
                      className="text-xs text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {!isOwner && (
        <div className="mt-2 text-xs text-center text-amber-600">
          {language === "english" 
            ? "You are viewing a chat that belongs to someone else" 
            : "आप किसी और के स्वामित्व वाली चैट देख रहे हैं"}
        </div>
      )}
    </form>
  );
};

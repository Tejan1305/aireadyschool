import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubjectSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SubjectSelection({
  value,
  onChange,
}: SubjectSelectionProps) {
  const subjects = ["Math", "Science", "English", "History", "Geography"];

  return (
    <div>
      <label
        htmlFor="subject"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Select the Subject
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a subject" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem
              key={subject}
              value={subject}
              className="text-neutral-500 hover:bg-neutral-100"
            >
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

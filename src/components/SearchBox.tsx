import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBox = ({ value, onChange, placeholder = "Search threat actors..." }: SearchBoxProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="neon-border p-4 bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent h-4 w-4" />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 bg-input border-2 border-border font-cyber text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
          />
        </div>
        <div className="text-xs text-center mt-2 cyber-text">
          🔍 SEARCH THE THREAT DATABASE 🔍
        </div>
      </div>
    </div>
  );
};
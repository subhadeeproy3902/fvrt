"use client";

import { Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormatSelectProps {
  formats: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  currentFormat?: string;
}

export function FormatSelect({
  formats,
  value,
  onChange,
  disabled,
  currentFormat,
}: FormatSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Convert to..." />
      </SelectTrigger>
      <SelectContent>
        {formats.map(format => (
          <SelectItem 
            key={format} 
            value={format}
            className="flex items-center justify-between"
          >
            <span className="capitalize">{format.toUpperCase()}</span>
            {format === currentFormat && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
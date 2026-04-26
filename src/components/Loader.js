import { Loader2 } from 'lucide-react';

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-muted animate-fade-in">
      <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}

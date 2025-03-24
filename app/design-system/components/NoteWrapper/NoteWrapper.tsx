interface NoteWrapperProps {
  children: React.ReactNode;
}

export const NoteWrapper = ({ children }: NoteWrapperProps) => {
  return (
    <div className="h-64 w-64 bg-amber-200 p-12 shadow-2xl inset-shadow-sm inset-shadow-amber-100">
      {children}
    </div>
  );
};

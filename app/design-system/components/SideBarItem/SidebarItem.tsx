interface SidebarItemProps {
  content: string;
}

export const SidebarItem = ({ content }: SidebarItemProps) => {
  return (
    <button className="hover:text-primary w-full cursor-pointer overflow-hidden px-4 py-2 text-left text-ellipsis whitespace-nowrap transition-all duration-200">
      {content}
    </button>
  );
};

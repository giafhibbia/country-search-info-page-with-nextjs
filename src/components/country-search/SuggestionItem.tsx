type Props = {
  name: string;
  onSelect: (name: string) => void;
  isActive?: boolean;
  onMouseEnter?: () => void;
};

export default function SuggestionItem({ name, onSelect, isActive, onMouseEnter }: Props) {
  return (
    <li
      className={`
        px-4 py-3 cursor-pointer text-[16px]
        font-normal text-[#232323]
        transition rounded-[6px]
        ${isActive ? "bg-[#8362F21A] text-[#8362F2]" : "hover:bg-[#8362F208]"}
      `}
      onClick={() => onSelect(name)}
      onMouseEnter={onMouseEnter}
    >
      {name}
    </li>
  );
}

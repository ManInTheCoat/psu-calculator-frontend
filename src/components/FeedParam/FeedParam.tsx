import type { FC } from "react";

interface FeedParamProps {
  icon: string;
  value: string;
  accent?: boolean;
  // Если передан - плашка становится кнопкой (лайк)
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}

// Плашка справа на ленте: значок и значение (мощность, вес, лайки)
export const FeedParam: FC<FeedParamProps> = ({
  icon,
  value,
  accent = false,
  onClick,
  disabled = false,
  title,
}) => {
  const content = (
    <>
      <span className={accent ? "feed__icon feed__icon--accent" : "feed__icon"}>{icon}</span>
      <span className="feed__value">{value}</span>
    </>
  );

  if (!onClick) {
    return <div className="feed__param">{content}</div>;
  }

  return (
    <button
      type="button"
      className="feed__param feed__param--button"
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {content}
    </button>
  );
};

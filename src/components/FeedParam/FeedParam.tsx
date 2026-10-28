import type { FC } from "react";

interface FeedParamProps {
  icon: string;
  value: string;
  accent?: boolean;
}

// Плашка справа на ленте: значок и значение (мощность, вес, лайки)
export const FeedParam: FC<FeedParamProps> = ({ icon, value, accent = false }) => (
  <div className="feed__param">
    <span className={accent ? "feed__icon feed__icon--accent" : "feed__icon"}>{icon}</span>
    <span className="feed__value">{value}</span>
  </div>
);

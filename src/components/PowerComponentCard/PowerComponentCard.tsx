import "./PowerComponentCard.css";
import type { FC } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { PowerComponentListItem } from "../../api/types";
import { DEFAULT_IMAGE, setDefaultImageOnError, toMediaUrl } from "../../media";
import { ROUTES } from "../../Routes";

interface PowerComponentCardProps {
  powerComponent: PowerComponentListItem;
  // Передаётся только для своих карточек (is_mine = 1) авторизованного пользователя
  onDelete?: (id: number) => void;
  disabled?: boolean;
}

// Карточка плитки: фото, название, мощность и лайки. По клику - лента с этим компонентом.
// У своих карточек - кнопка «Удалить».
export const PowerComponentCard: FC<PowerComponentCardProps> = ({
  powerComponent,
  onDelete,
  disabled = false,
}) => {
  const { id, title, image_url, power_watt, likes_count } = powerComponent;

  return (
    <Card className="powerComponentCard">
      <Card.Img
        variant="top"
        className="powerComponentCard__image"
        src={toMediaUrl(image_url) || DEFAULT_IMAGE}
        alt={title}
        onError={setDefaultImageOnError}
      />
      <Card.Body className="powerComponentCard__body">
        <Card.Title className="powerComponentCard__title">
          {/* stretched-link делает ссылкой всю карточку */}
          <Link to={`${ROUTES.FEED}/${id}`} className="stretched-link powerComponentCard__link">
            {title}
          </Link>
        </Card.Title>
        <div className="powerComponentCard__meta">
          <Badge bg="light" text="dark" className="powerComponentCard__power">
            ⚡ {power_watt ?? "-"} Вт
          </Badge>
          <span className="powerComponentCard__likes">♥ {likes_count}</span>
        </div>
        {onDelete && (
          <Button
            variant="outline-danger"
            size="sm"
            className="powerComponentCard__delete"
            disabled={disabled}
            onClick={() => onDelete(id)}
          >
            Удалить
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

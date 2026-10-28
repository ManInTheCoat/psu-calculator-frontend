import "./PowerComponentCard.css";
import type { FC } from "react";
import { Badge, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { PowerComponentListItem } from "../../api/types";
import { DEFAULT_IMAGE, setDefaultImageOnError } from "../../media";
import { ROUTES } from "../../Routes";

interface PowerComponentCardProps {
  powerComponent: PowerComponentListItem;
}

// Карточка плитки: фото, название, мощность и лайки. По клику - лента с этим компонентом
export const PowerComponentCard: FC<PowerComponentCardProps> = ({ powerComponent }) => {
  const { id, title, image_url, power_watt, likes_count } = powerComponent;

  return (
    <Card as={Link} to={`${ROUTES.FEED}/${id}`} className="powerComponentCard">
      <Card.Img
        variant="top"
        className="powerComponentCard__image"
        src={image_url || DEFAULT_IMAGE}
        alt={title}
        onError={setDefaultImageOnError}
      />
      <Card.Body className="powerComponentCard__body">
        <Card.Title className="powerComponentCard__title">{title}</Card.Title>
        <div className="powerComponentCard__meta">
          <Badge bg="light" text="dark" className="powerComponentCard__power">
            ⚡ {power_watt} Вт
          </Badge>
          <span className="powerComponentCard__likes">♥ {likes_count}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

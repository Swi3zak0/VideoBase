import { CardBody, Card } from "react-bootstrap";
import { IoLogoGithub } from "react-icons/io";

function Footer() {
  return (
    <Card>
      <CardBody className="footer">
        2024 &copy; Copyright by MPM{" "}
        <a
          className="footer-link"
          target="blank"
          href="https://github.com/Swi3zak0/VideoBase"
        >
          {" "}
          <IoLogoGithub />
        </a>
      </CardBody>
    </Card>
  );
}

export default Footer;

import React from "react";
import { useHistory } from "react-router-dom";
import guides from "./../media/guide.json";
import { Accordion, Card } from "react-bootstrap";
import { ThemeContext } from "../utilities/ThemeContext";

const HelpPage = () => {
  const history = useHistory();
  const { theme, toggleTheme } = React.useContext(ThemeContext);

  return (
    <>
      <header>
        <h1>
          <i
            className="bi bi-chevron-left"
            onClick={() => history.push("/")}
          ></i>
          Help
        </h1>
        <button onClick={toggleTheme} className="btn btn-success">
          <i
            className={`bi bi-${theme === "light" ? "sun-fill" : "moon-fill"}`}
          ></i>
        </button>
      </header>
      <Accordion>
        {guides.map((guide, num) => {
          return (
            <Card key={num}>
              <Accordion.Toggle as={Card.Header} eventKey={num + 1}>
                {guide[0]}
                <i className={`bi bi-${guide[2]}`}></i>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={num + 1}>
                <Card.Body>{guide[1]}</Card.Body>
              </Accordion.Collapse>
            </Card>
          );
        })}
      </Accordion>
    </>
  );
};

export default HelpPage;

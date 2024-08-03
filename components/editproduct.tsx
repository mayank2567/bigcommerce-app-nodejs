import { ChangeEvent, FormEvent, useState } from "react";
import { FormData, StringKeyValue } from "../types";
import { useSession } from "../context/session";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextareaAutosize from "react-textarea-autosize";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const InputForm = ({ formData, onCancel, onSubmit }) => {
  const encodedContext = useSession()?.context;

  const { description, isVisible, name, price, type } = formData;
  const [form, setForm] = useState({
    description,
    isVisible,
    name,
    price,
    type,
  });
  const [errors, setErrors] = useState<StringKeyValue>({});
  const [gptdescription, setGptdescription] = useState({ __html: "" });
  const savegptdescription = async () => {
    setForm((prevForm) => ({
      ...prevForm,
      description: gptdescription.__html,
    }));
  };
  const genratedescriptionusinggpt = async () => {
    try {
      setGptdescription({ __html: null });
      let prompt = `Add with html tags line ul li br h1 h2 p etc for formatting to be to be redered on website, Enrich plagiarism free persuasive product description for 
            "${form.name}" with model number "WALGWP-INFM".
            The description should demonstrate Expertise, Authoritativeness and Trustworthiness. The description should be comprehensive and should have a transactional intent. The description should be in an engaging format. Highlight Key features, offer detailed specifications, include factual ballistics and performance analysis. Add sections such as Overview, Key Features, Detailed Specifications with actual values, Ballistics and Performance Analysis, Benefits of this particular ammunition, Usage scenarios of this ammunition, Compatibility, Quality Assurance followed by the manufacturer, Accuracy and Precision metrics of this ammunition and Finally Expert Insights. To allow the product description is detailed enough, please include any other external information that may not be requested here to reach to a total word length of at least 1500 words and maximum of 3000 words. Include a compelling call to action encouraging customers to purchase now!`;
      const response = await fetch(
        `/api/gptprompt?context=${encodedContext}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: prompt,
          }),
        }
      );

      const data = await response.json();
      // show the data in the description in alert box
      // alert('data.description');
      setGptdescription({ __html: data.data });

      // setForm(prevForm => ({ ...prevForm, description: 'data.description' }));
      // render the same page again
    } catch (error) {
      console.error("Error updating the product: ", error);
    }
  };
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name: formName, value } = event.target || {};
    setForm((prevForm) => ({ ...prevForm, [formName]: value }));
  };

  const handleSelectChange = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, type: value }));
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, name: formName } = event.target || {};
    setForm((prevForm) => ({ ...prevForm, [formName]: checked }));
  };

  const handleSubmit = (event: FormEvent<EventTarget>) => {
    event.preventDefault();

    // If there are errors, do not submit the form
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) return;

    onSubmit(form);
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <h1>Basic Information</h1>
                </Col>
                <Col align="end">
                  <Button onClick={onCancel} variant="danger">
                    Cancel
                  </Button>{" "}
                  <Button onClick={handleSubmit} variant="success">
                    Submit
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Product name</Form.Label>
                    <Form.Control
                      required
                      value={form.name}
                      onChange={handleChange}
                      id="name"
                      placeholder="Product name"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Label>Product type</Form.Label>
                  <Form.Select
                    aria-label="Product Type"
                    required
                    value={form.type}
                    onChange={handleChange}
                    id="type"
                  >
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Product price</Form.Label>
                  <Form.Control
                    required
                    value={form.price}
                    onChange={handleChange}
                    id="price"
                    placeholder="Product price"
                  />
                </Col>
                <Col>
                  <Form.Label>Visible on storefront</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Check me out"
                    checked={form.isVisible}
                    onChange={handleCheckboxChange}
                    id="isVisible"
                  />
                </Col>
              </Row>
              <Row>
                <Form.Label>Description</Form.Label>

                <TextareaAutosize
                  required
                  value={form.description}
                  onChange={handleChange}
                  id="description"
                  placeholder="Product description"
                  maxRows={10}
                />
              </Row>
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <br></br>
        </Row>
        <Card>
          <Card.Body>
            <Row>
              <Col xs={8}>
                <h3>GPT Description</h3>
              </Col>
              <Col align="end">
                {gptdescription.__html != "" &&
                gptdescription.__html != null ? (
                  <Button onClick={savegptdescription}>
                    Save GPT Description
                  </Button>
                ) : null}{" "}
                <Button onClick={genratedescriptionusinggpt}>Generate</Button>
              </Col>
              <Row></Row>
              <Col>
                <br></br>
                <br></br>

                <br></br>
                <br></br>
                {gptdescription.__html == null ? (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                  </Box>
                ) : null}
              </Col>
              <div dangerouslySetInnerHTML={gptdescription} />
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Row>
              <Col xs={8}>
                <h3>GPT Description</h3>
              </Col>
              <Col align="end">
                {gptdescription.__html != "" &&
                gptdescription.__html != null ? (
                  <Button onClick={savegptdescription}>
                    Save GPT Description
                  </Button>
                ) : null}{" "}
                <Button onClick={genratedescriptionusinggpt}>Generate</Button>
              </Col>
              <Row></Row>
              <Col>
                {gptdescription.__html == null ? (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                  </Box>
                ) : null}
              </Col>
              <div dangerouslySetInnerHTML={gptdescription} />
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Row>
              <Col xs={8}>
                <h3>GPT Description</h3>
              </Col>
              <Col align="end">
                {gptdescription.__html != "" &&
                gptdescription.__html != null ? (
                  <Button onClick={savegptdescription}>
                    Save GPT Description
                  </Button>
                ) : null}{" "}
                <Button onClick={genratedescriptionusinggpt}>Generate</Button>
              </Col>
              <Row></Row>
              <Col>
                {gptdescription.__html == null ? (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                  </Box>
                ) : null}
              </Col>
              <div dangerouslySetInnerHTML={gptdescription} />
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Row>
              <Col xs={8}>
                <h3>GPT Description</h3>
              </Col>
              <Col align="end">
                {gptdescription.__html != "" &&
                gptdescription.__html != null ? (
                  <Button onClick={savegptdescription}>
                    Save GPT Description
                  </Button>
                ) : null}{" "}
                <Button onClick={genratedescriptionusinggpt}>Generate</Button>
              </Col>
              <Row></Row>
              <Col>
                {gptdescription.__html == null ? (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                  </Box>
                ) : null}
              </Col>
              <div dangerouslySetInnerHTML={gptdescription} />
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default InputForm;

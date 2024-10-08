import { ChangeEvent, FormEvent, useState } from "react";
import { FormData, StringKeyValue } from "../types";
import { useSession } from "../context/session";
import TextareaAutosize from "react-textarea-autosize";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import getPromts from "./prompts";
const InputForm = ({ formData, onCancel, onSubmit }) => {
  const encodedContext = useSession()?.context;
  console.log("formData", formData);
  const { description, isVisible, name, price, type, page_type } = formData;
  const [form, setForm] = useState({
    description,
    isVisible,
    name,
    price,
    type,
    page_type,
  });
  const [errors, setErrors] = useState<StringKeyValue>({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (text) => {
    setShow(text);
  };
  const [descriptionspinner, setDescriptionspinner] = useState(false);
  const [metaDescriptionspinner, setMetaDescriptionspinner] = useState(false);
  const [searchKeywordsSpinner, setSearchKeywordsSpinner] = useState(false);
  const [metaKeywordsSpinner, setMetaKeywordsSpinner] = useState(false);
  const [meta_description, setMeta_description] = useState(
    formData.meta_description || ""
  );
  const [search_keywords, setSearch_keywords] = useState(
    formData.search_keywords || ""
  );
  const [meta_keywords, setMeta_keywords] = useState(
    formData.meta_keywords?.join(",") || ""
  );

  const genratedescriptionusinggpt = async () => {
    try {
      setForm((prevForm) => ({ ...prevForm, description: "Generating" }));
      setDescriptionspinner(true);
      let prompt = getPromts(form.name, form.page_type, "description");
      const response = await fetch(`/api/gptprompt?context=${encodedContext}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      const data = await response.json();
      setDescriptionspinner(false);
      setForm((prevForm) => ({ ...prevForm, description: data.data }));
    } catch (error) {
      console.error("Error updating the product: ", error);
    }
  };

  const genrateMetaDescriptionusinggpt = async () => {
    try {
      setForm((prevForm) => ({ ...prevForm, meta_description: "Generating" }));
      setMetaDescriptionspinner(true);
      let prompt = getPromts(form.name, form.page_type, "meta_description");
      const response = await fetch(`/api/gptprompt?context=${encodedContext}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      const data = await response.json();
      setMeta_description(data.data);
      setMetaDescriptionspinner(false);
      setForm((prevForm) => ({ ...prevForm, meta_description: data.data }));
    } catch (error) {
      console.error("Error updating the product: ", error);
    }
  };
  const genrateSearchKeywordsusinggpt = async () => {
    try {
      setForm((prevForm) => ({ ...prevForm, search_keywords: "Generating" }));
      setSearchKeywordsSpinner(true);
      let prompt = getPromts(form.name, form.page_type, "search_keywords");
      const response = await fetch(`/api/gptprompt?context=${encodedContext}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      const data = await response.json();
      setSearch_keywords(data.data);
      setSearchKeywordsSpinner(false);
      setForm((prevForm) => ({ ...prevForm, search_keywords: data.data }));
    } catch (error) {
      console.error("Error updating the product: ", error);
    }
  };
  const genrateMetaKeywordsusinggpt = async () => {
    try {
      setForm((prevForm) => ({ ...prevForm, meta_keywords: "Generating" }));
      setMetaKeywordsSpinner(true);
      let prompt = getPromts(form.name, form.page_type, "meta_keywords");
      const response = await fetch(`/api/gptprompt?context=${encodedContext}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      const data = await response.json();
      let meta_keywords_temp = data.data.split(",");
      setMeta_keywords(data.data);
      setForm((prevForm) => ({
        ...prevForm,
        meta_keywords: meta_keywords_temp,
      }));
      setMetaKeywordsSpinner(false);
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
        <Modal size="xl" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div dangerouslySetInnerHTML={{ __html: show }}></div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
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
                    <Form.Label>{page_type} name</Form.Label>
                    <Form.Control
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      id="name"
                      placeholder="Product name"
                    />
                  </Form.Group>
                </Col>
                {page_type === "Product"?
                <Col>
                  <Form.Label>{page_type} type</Form.Label>
                  <Form.Select
                    name="type"
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
                  :null}
              </Row>
              {page_type === "Product"?
              <Row>
                <Col>
                  <Form.Label>Product price</Form.Label>
                  <Form.Control
                    name="price"
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
                    name="isVisible"
                    type="checkbox"
                    label="Check me out"
                    checked={form.isVisible}
                    onChange={handleCheckboxChange}
                    id="isVisible"
                  />
                </Col>
              </Row>
              :null}
              {/* <Row>
                <Form.Label>Description</Form.Label>

                
              </Row> */}
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <br></br>
        </Row>
        {page_type !== "Brand"?
        <Card>
          <Card.Body>
            <Row>
              <Col xs={8}>
                <h3>Generate Description</h3>
              </Col>
              <Col align="end">
                <Button onClick={() => handleShow(form.description)}>
                  Preview
                </Button>{" "}
                <Button onClick={genratedescriptionusinggpt}>
                  {" "}
                  {descriptionspinner ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Generate"
                  )}
                  </Button>
              </Col>

              <Row>
                <TextareaAutosize
                  required
                  value={form.description}
                  onChange={handleChange}
                  id="description"
                  placeholder="Description"
                  maxRows={10}
                />
              </Row>
              <Col>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        :null}
        <Card>
          <Card.Body>
            <Row>
              <Col xs={8}>
                <h3>Generate Meta Description</h3>
              </Col>
              <Col align="end">
                <Button onClick={genrateMetaDescriptionusinggpt}>
                  {" "}
                  {metaDescriptionspinner ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Generate"
                  )}
                </Button>
              </Col>
              
              <TextareaAutosize
                required
                value={meta_description}
                onChange={handleChange}
                id="meta_description"
                placeholder="Meta description"
                maxRows={10}
              />
              <Row></Row>
              <Col></Col>
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Row>
              <Col xs={8}>
                <h3>Generate Search Keywords</h3>
              </Col>
              <Col align="end">
                <Button onClick={genrateSearchKeywordsusinggpt}>
                  {" "}
                  {searchKeywordsSpinner ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Generate"
                  )}
                </Button>
              </Col>

              <Row>
                

                <TextareaAutosize
                  required
                  value={search_keywords}
                  onChange={handleChange}
                  id="search_keywords"
                  placeholder="Search keywords"
                  maxRows={10}
                />
              </Row>
              <Col></Col>
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Row>
              <Col xs={8}>
                <h3>Generate Meta Keywords</h3>
              </Col>
              <Col align="end">
                <Button onClick={genrateMetaKeywordsusinggpt}>
                  {" "}
                  {metaKeywordsSpinner ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Generate"
                  )}
                </Button>
              </Col>

              <Row>
                <TextareaAutosize
                  required
                  value={meta_keywords}
                  onChange={handleChange}
                  id="meta_keywords"
                  placeholder="Meta keywords"
                  maxRows={10}
                />
              </Row>
              <Col></Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default InputForm;

import AccordionItem from "../components/AccordionItem";

const ExamplePage = () => {
  return (
    <div className="max-w-lg mx-auto p-6">
      <AccordionItem title="Section 1">
        <p>This is the content of Section 1.</p>
      </AccordionItem>
      <AccordionItem title="Section 2">
        <p>This is the content of Section 2.</p>
      </AccordionItem>
    </div>
  );
};

export default ExamplePage;

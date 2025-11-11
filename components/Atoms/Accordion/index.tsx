import { Accordion as MantineAccordion } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { AccordionT } from "./type";
import "./style.css";

const Accordion = ({ items = [], ...rest }: AccordionT) => (
  <MantineAccordion {...rest} chevron={<IconPlus />} className={`accordion-container ${rest.className}`}>
    {items.map((item) => (
      <MantineAccordion.Item key={item.value} value={item.value}>
        <MantineAccordion.Control>{item.title}</MantineAccordion.Control>
        <MantineAccordion.Panel>{item.content}</MantineAccordion.Panel>
      </MantineAccordion.Item>
    ))}
  </MantineAccordion>
);

export default Accordion;
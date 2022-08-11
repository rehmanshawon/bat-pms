import React, { useEffect, useState, useRef } from "react";

//for jodit editor
import dynamic from "next/dynamic";
const importJodit = () => import("jodit-react");
const JoditEditor = dynamic(importJodit, { ssr: false });

export const FormEditor = ({ name, value, onChange, getEvent, ...rest }) => {
  const editor = useRef(null);
  const config = { readonly: rest.readOnly ? true : false };

  //initial content
  const [content, setContent] = useState("");

  //when update content
  const updateContent = (value) => {
    if (onChange) {
      onChange(value);
    }

    let target = { name: name, value: value };
    if (getEvent) {
      getEvent({ target });
    }
  };

  //when change
  // const handleChange = (value) => {
  //   let target = { name: name, value: value };
  //   if (getEvent) {
  //     getEvent({ target });
  //   }
  // };

  //handle input effect
  useEffect(() => {
    setContent(value);
  }, [name, value]);

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1}
      onBlur={updateContent}
    />
  );
};

export default FormEditor;

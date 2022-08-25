import React, { useState, useEffect, useRef } from "react";

export const FormTextEditor = ({
  name,
  value,
  onChange,
  getEvent,
  ...rest
}) => {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const editorConfiguration = {
    removePlugins: ["EasyImage", "ImageUpload", "MediaEmbed"],
  };

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

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

  //handle input effect
  useEffect(() => {
    setContent(value ?? "");
  }, [name, value]);

  return editorLoaded ? (
    <CKEditor
      editor={ClassicEditor}
      data={content}
      onReady={(editor) => {
        // console.log("Editor is ready to use!", editor);
      }}
      // onChange={(event, editor) => {

      // }}
      onBlur={(event, editor) => {
        //console.log("------", editor.getData(), "------");
        updateContent(editor.getData());
      }}
      onFocus={(event, editor) => {
        // console.log("Focus.", editor);
      }}
      config={editorConfiguration}
    />
  ) : (
    <div>Editor loading</div>
  );
};

export default FormTextEditor;

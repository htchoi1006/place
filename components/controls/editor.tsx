'use client';
import React, { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKeditorProps {
  onChange: (data: string) => void;
  // editorLoaded: boolean;
  // name: string;
  // value: string;
}

export default function Editor({ onChange, }: CKeditorProps) {
  const [data, setData] = useState<string>("");
  useEffect(()=>{
    // alert('useEffect')
    onChange(data);
  }, [data, onChange])
  const handleTextChange = (data: string) => {
    // alert('text changed')
    // setData(data);
    onChange(data);
  };
  const setMinHeight = (editor: any) => {
    editor.ui.view.editable.element.style.minHeight = "400px";
  };
  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onReady={(editor: any) => {
          setMinHeight(editor);
        }}
        onChange={(event, editor: any) => {
          // setData(editor.getData())
          handleTextChange(editor.getData());
          // setMinHeight(editor);
          // handleTextChange(data);
        }}
        onBlur={(event, editor) => {
          setMinHeight(editor);
          console.log('Blur.', event);
        }}
        onFocus={(event, editor) => {
          setMinHeight(editor);
          // console.log('Focus.', editor);
        }}

      />
    </>
  );
}